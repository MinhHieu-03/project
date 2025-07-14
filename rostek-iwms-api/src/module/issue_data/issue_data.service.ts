import {
    HttpException,
    HttpStatus,
    Injectable,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { chunk } from "lodash";
import { IssueDataDto } from "src/dtos/IssueData.dto";
import { IssueData } from "src/shemas/issue_data.entity";
import { convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class IssueDataService {
    constructor(
        @InjectRepository(IssueData)
        private issueDataRepository: Repository<IssueData>,
    ) { }

    async getAll(params: any) {
        const data = await this.issueDataRepository.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const queryBuilder = this.issueDataRepository.createQueryBuilder('issue_data');

            // Apply filters
            if (body.filter) {
                Object.keys(body.filter).forEach(key => {
                    if (body.filter[key] !== undefined && body.filter[key] !== null) {
                        queryBuilder.andWhere(`issue_data.${key} LIKE :${key}`, { [key]: `%${body.filter[key]}%` });
                    }
                });
            }

            // Apply sorting
            if (body.sort) {
                const sortItems = typeof body.sort === 'string' ? JSON.parse(body.sort) : body.sort;
                if (Array.isArray(sortItems)) {
                    sortItems.forEach((sortItem: any) => {
                        queryBuilder.addOrderBy(`issue_data.${sortItem.field}`, sortItem.direction.toUpperCase());
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
        const data = await this.issueDataRepository.findOne({ where: { id } });
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByIssordNo(issord_no: string) {
        const data = await this.issueDataRepository.find({
            where: { issord_no: issord_no }
        });
        if (!data)
            throw new HttpException("Issue order not found", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async create(data: IssueDataDto) {
        try {
            const newData = this.issueDataRepository.create(data);
            const savedData = await this.issueDataRepository.save(newData);
            return convertDataResponse("Create Success", savedData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: number) {
        const existingData = await this.issueDataRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.issueDataRepository.update(id, data);
        const updatedData = await this.issueDataRepository.findOne({ where: { id } });
        return convertDataResponse("Update Success", updatedData);
    }

    async delete(id: number) {
        const existingData = await this.issueDataRepository.findOne({ where: { id } });
        if (!existingData) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        await this.issueDataRepository.delete(id);
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
                            const existingIssue = await this.issueDataRepository.findOne({
                                where: { issord_no: trimText(item.issord_no) }
                            });

                            const issueData = {
                                section_c: trimText(item.section_c),
                                line_c: trimText(item.line_c),
                                issord_no: trimText(item.issord_no),
                                issord_dtl_no: trimText(item.issord_dtl_no),
                                material_no: trimText(item.material_no),
                                issue_qty: Number(item.issue_qty) || 0,
                                issued_qty: Number(item.issued_qty) || 0,
                                plan_dt: item.plan_dt ? new Date(item.plan_dt) : null,
                                data1: trimText(item.data1) || "",
                                data2: trimText(item.data2) || "",
                                data3: trimText(item.data3) || "",
                                data4: trimText(item.data4) || "",
                                data5: trimText(item.data5) || "",
                                userid: trimText(item.userid) || "",
                            };

                            if (existingIssue) {
                                await this.issueDataRepository.update(existingIssue.id, issueData);
                            } else {
                                const newIssue = this.issueDataRepository.create(issueData);
                                await this.issueDataRepository.save(newIssue);
                            }
                        } catch (err) {
                            listErrors.push({
                                issord_no: item.issord_no,
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
