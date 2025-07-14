import {
    HttpException,
    HttpStatus,
    Injectable,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { chunk } from "lodash";
import { MaterialMstDto } from "src/dtos/MaterialMst.dto";
import { MaterialMst } from "src/shemas/material_mst.entity";
import { convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class MaterialMstService {
    constructor(
        @InjectRepository(MaterialMst)
        private materialMstRepository: Repository<MaterialMst>,
    ) { }

    async getAll(params: any) {
        const data = await this.materialMstRepository.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const queryBuilder = this.materialMstRepository.createQueryBuilder('material_mst');

            // Apply filters
            if (body.filter) {
                Object.keys(body.filter).forEach(key => {
                    if (body.filter[key] !== undefined && body.filter[key] !== null) {
                        queryBuilder.andWhere(`material_mst.${key} LIKE :${key}`, { [key]: `%${body.filter[key]}%` });
                    }
                });
            }

            // Apply sorting
            if (body.sort) {
                const sortItems = typeof body.sort === 'string' ? JSON.parse(body.sort) : body.sort;
                if (Array.isArray(sortItems)) {
                    sortItems.forEach((sortItem: any) => {
                        queryBuilder.addOrderBy(`material_mst.${sortItem.field}`, sortItem.direction.toUpperCase());
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
        const data = await this.materialMstRepository.findOne({ where: { id } });
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByMaterialNo(material_no: string) {
        const data = await this.materialMstRepository.findOne({
            where: { material_no: material_no }
        });
        if (!data)
            throw new HttpException("Material not found", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async create(data: MaterialMstDto) {
        try {
            const newData = this.materialMstRepository.create(data);
            const savedData = await this.materialMstRepository.save(newData);
            return convertDataResponse("Create Success", savedData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: number) {
        const existingData = await this.materialMstRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.materialMstRepository.update(id, data);
        const updatedData = await this.materialMstRepository.findOne({ where: { id } });
        return convertDataResponse("Update Success", updatedData);
    }

    async delete(id: number) {
        const existingData = await this.materialMstRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.materialMstRepository.delete(id);
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
                            const existingMaterial = await this.materialMstRepository.findOne({
                                where: { material_no: trimText(item.material_no) }
                            });

                            const materialData = {
                                material_no: trimText(item.material_no),
                                material_nm: trimText(item.material_nm),
                                material_tp: trimText(item.material_tp),
                                pk_style: Number(item.pk_style) || 0,
                                new_pk_style: Number(item.new_pk_style) || 0,
                                flg: Number(item.flg) || 0,
                                comment: trimText(item.comment) || "",
                            };

                            if (existingMaterial) {
                                await this.materialMstRepository.update(existingMaterial.id, materialData);
                            } else {
                                const newMaterial = this.materialMstRepository.create(materialData);
                                await this.materialMstRepository.save(newMaterial);
                            }
                        } catch (err) {
                            listErrors.push({
                                material_no: item.material_no,
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
