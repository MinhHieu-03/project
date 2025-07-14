import {
    HttpException,
    HttpStatus,
    Injectable,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { chunk } from "lodash";
import { MaterialRecvDataDto } from "src/dtos/MaterialRecvData.dto";
import { MaterialRecvData } from "src/shemas/material_recv_data.entity";
import { convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class MaterialRecvDataService {
    constructor(
        @InjectRepository(MaterialRecvData)
        private materialRecvDataRepository: Repository<MaterialRecvData>,
    ) { }

    async getAll(params: any) {
        const data = await this.materialRecvDataRepository.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const queryBuilder = this.materialRecvDataRepository.createQueryBuilder('material_recv_data');

            // Apply filters
            if (body.filter) {
                Object.keys(body.filter).forEach(key => {
                    if (body.filter[key] !== undefined && body.filter[key] !== null) {
                        queryBuilder.andWhere(`material_recv_data.${key} LIKE :${key}`, { [key]: `%${body.filter[key]}%` });
                    }
                });
            }

            // Apply sorting
            if (body.sort) {
                const sortItems = typeof body.sort === 'string' ? JSON.parse(body.sort) : body.sort;
                if (Array.isArray(sortItems)) {
                    sortItems.forEach((sortItem: any) => {
                        queryBuilder.addOrderBy(`material_recv_data.${sortItem.field}`, sortItem.direction.toUpperCase());
                    });
                }
            }

            // Apply pagination
            const page = Number(body.page) || 1;
            const limit = Number(body.limit) || 10;
            if (page && limit) {
                queryBuilder.skip((page - 1) * limit).take(limit);
            }

            const [data, total] = await queryBuilder.getManyAndCount();

            return {
                message: "OK",
                data: data,
                total: total,
                page: page,
                pageSize: limit
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: number) {
        const data = await this.materialRecvDataRepository.findOne({ where: { id } });
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByMaterialNo(material_no: string) {
        const data = await this.materialRecvDataRepository.find({
            where: { material_no: material_no }
        });
        if (!data || data.length === 0)
            throw new HttpException("Material not found", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByPalletId(pallet_id: string) {
        const data = await this.materialRecvDataRepository.findOne({
            where: { pallet_id: pallet_id }
        });
        if (!data)
            throw new HttpException("Pallet not found", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByInvoiceNo(invoice_no: string) {
        const data = await this.materialRecvDataRepository.find({
            where: { invoice_no: invoice_no }
        });
        if (!data || data.length === 0)
            throw new HttpException("Invoice not found", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async create(data: MaterialRecvDataDto) {
        try {
            const newData = this.materialRecvDataRepository.create(data);
            const savedData = await this.materialRecvDataRepository.save(newData);
            return convertDataResponse("Create Success", savedData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: number) {
        const existingData = await this.materialRecvDataRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.materialRecvDataRepository.update(id, data);
        const updatedData = await this.materialRecvDataRepository.findOne({ where: { id } });
        return convertDataResponse("Update Success", updatedData);
    }

    async delete(id: number) {
        const existingData = await this.materialRecvDataRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.materialRecvDataRepository.delete(id);
        return {
            msg: "Delete Success",
        };
    }

    async processExcelFile(data: any) {
        if (!data) {
            throw new BadRequestException("No file uploaded");
        }

        try {
            const chunkSize = 10;
            const chunkData = chunk(data, chunkSize);
            const listErrors = [];

            for (let i = 0; i < chunkData.length; i++) {
                await Promise.all(
                    chunkData[i].map(async (item: any) => {
                        try {
                            const existingRecv = await this.materialRecvDataRepository.findOne({
                                where: { pallet_id: trimText(item.pallet_id) }
                            });

                            const recvData = {
                                section_c: trimText(item.section_c),
                                supplier_c: trimText(item.supplier_c),
                                invoice_no: trimText(item.invoice_no),
                                pallet_id: trimText(item.pallet_id),
                                material_no: trimText(item.material_no),
                                recv_qty: Number(item.recv_qty) || 0,
                                Scanned_qty: Number(item.Scanned_qty) || 0,
                                flg: trimText(item.flg) || "0",
                                userid: trimText(item.userid) || "",
                            };

                            if (existingRecv) {
                                await this.materialRecvDataRepository.update(existingRecv.id, recvData);
                            } else {
                                const newRecv = this.materialRecvDataRepository.create(recvData);
                                await this.materialRecvDataRepository.save(newRecv);
                            }
                        } catch (err) {
                            listErrors.push({
                                pallet_id: item.pallet_id,
                                error: err.message,
                            });
                        }
                    })
                );
            }

            return {
                message: "Data imported successfully",
                countFails: listErrors.length,
                countSuccess: data.length - listErrors.length,
                listErrors,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Failed to process file: ${error.message}`);
        }
    }
}

const trimText = (text: string) => {
    try {
        return text.trim();
    } catch {
        return text;
    }
};
