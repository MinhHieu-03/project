import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { chunk } from "lodash";
import { IssueTimeScheduleDto } from "src/dtos/IssueTimeSchedule.dto";
import { IssueTimeSchedule } from "src/shemas/issue_time_schedule.entity";
import { IssueDataDto } from "src/dtos/IssueData.dto";
import { IssueData } from "src/shemas/issue_data.entity";
import { convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { Inventory } from "src/shemas/inventory.schema";

@Injectable()
export class IssueTimeScheduleService {
  constructor(
    @InjectRepository(IssueTimeSchedule)
    private issueTimeScheduleRepository: Repository<IssueTimeSchedule>,
    @InjectRepository(IssueData)
    private issueData: Repository<IssueDataDto>,
    @InjectModel(Inventory.name) private moduleInventory: Model<Inventory>,
  ) {}

  async getAll(params: any) {
    const data = await this.issueTimeScheduleRepository.find(params);
    return convertDataResponse("OK", data);
  }

  async getByFilter(body: FilterQuery) {
    try {
      const queryBuilder = this.issueTimeScheduleRepository.createQueryBuilder(
        "issue_time_schedule",
      );

      // Apply filters
      if (body.filter) {
        Object.keys(body.filter).forEach((key) => {
          if (body.filter[key] !== undefined && body.filter[key] !== null) {
            queryBuilder.andWhere(`issue_time_schedule.${key} LIKE :${key}`, {
              [key]: `%${body.filter[key]}%`,
            });
          }
        });
      }

      // Apply sorting
      if (body.sort) {
        const sortItems =
          typeof body.sort === "string" ? JSON.parse(body.sort) : body.sort;
        if (Array.isArray(sortItems)) {
          sortItems.forEach((sortItem: any) => {
            queryBuilder.addOrderBy(
              `issue_time_schedule.${sortItem.field}`,
              sortItem.direction.toUpperCase(),
            );
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
        metaData: data,
        total: total,
        page: page,
        pageSize: limit,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getInventorys({ listInventory, issue_qty, material_no }, issueData) {
    const material = material_no.trim();

    // 1. Check exact match
    const getFullBox = await this.moduleInventory.findOne({
      sku: material,
      status: "fill",
      available: issue_qty,
    });

    if (getFullBox) {
      await getFullBox.updateOne({ $inc: { available: -issue_qty } });
      listInventory.push({
        inventory: getFullBox,
        issue_qty,
        inventory_qty: getFullBox.available,
        id: issueData.id,
        material_no: issueData.material_no,
        issord_no: issueData.issord_no,
        issord_dtl_no: issueData.issord_dtl_no,
      });
      return listInventory;
    }

    // 2. Fallback to partial inventory
    const inventory = await this.moduleInventory
      .findOne({ sku: material, status: "fill", available: { $gt: 0 } })
      .sort({ createdAt: -1 });

    if (!inventory) {
      listInventory.push({
        inventory: null,
        issue_qty: issue_qty,
        inventory_qty: 0,
        message: `Material ${material} not found in inventory`,
        id: issueData.id,
        material_no: issueData.material_no,
        issord_no: issueData.issord_no,
        issord_dtl_no: issueData.issord_dtl_no,
      });
      return listInventory;
    }
    console.log("inventory",issue_qty, material, inventory);

    if (inventory.available >= issue_qty) {
      await inventory.updateOne({ $inc: { available: -issue_qty } });
      listInventory.push({
        inventory,
        issue_qty,
        inventory_qty: inventory.available,
        id: issueData.id,
        material_no: issueData.material_no,
        issord_no: issueData.issord_no,
        issord_dtl_no: issueData.issord_dtl_no,
      });
      return listInventory;
    } else {
      const available = inventory.available;
      await inventory.updateOne({ $inc: { available: -available } });

      listInventory.push({
        inventory,
        issue_qty: available,
        inventory_qty: available,
        id: issueData.id,
        material_no: issueData.material_no,
        issord_no: issueData.issord_no,
        issord_dtl_no: issueData.issord_dtl_no,
      });

      return this.getInventorys(
        {
          listInventory,
          issue_qty: issue_qty - available,
          material_no,
        },
        issueData,
      );
    }
  }

  async pickingOrder({ issue_order_no }: { issue_order_no: string[] }) {
    const data = await this.issueData.find({
      where: { issord_no: In(issue_order_no) },
    });

    if (!data)
      throw new HttpException(
        "Issue order number invalid",
        HttpStatus.NOT_FOUND,
      );
    // all material
    // => find inventory
    data.length === 100;
    const listInventory = [];

    const chunkSize = 50;
    const chunkData = chunk(data, chunkSize);
    const listErrors = [];

    for (let i = 0; i < chunkData.length; i++) {
      await Promise.all(
        chunkData[i].map(async (item: any) => {
          try {
            const { issue_qty, material_no } = item;
            await this.getInventorys(
              { listInventory, issue_qty, material_no },
              item,
            );
          } catch (err) {
            listErrors.push({
              issue_ord_no: item.issue_ord_no,
              error: err.message,
            });
          }
        }),
      );
    }

    // console.log("data", data.length);
    // for (const item of data) {
    //   const { issue_qty, material_no } = item;
    //   console.log("issue_qty",material_no, issue_qty);
    //   await this.getInventorys({ listInventory, issue_qty, material_no });
    // }
    // => create picking order

    return convertDataResponse("Ok", listInventory);
  }
  async getById(issue_ord_no: string) {
    const data = await this.issueTimeScheduleRepository.findOne({
      where: { issue_ord_no },
    });
    if (!data)
      throw new HttpException(
        "Issue order number invalid",
        HttpStatus.NOT_FOUND,
      );
    return convertDataResponse("Ok", data);
  }

  async getByProdNo(prod_no: string) {
    const data = await this.issueTimeScheduleRepository.findOne({
      where: { prod_no: prod_no },
    });
    if (!data)
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async getByIssordNo(issue_ord_no: string) {
    const data = await this.issueTimeScheduleRepository.findOne({
      where: { issue_ord_no: issue_ord_no },
    });
    if (!data)
      throw new HttpException("Issue order not found", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: IssueTimeScheduleDto) {
    try {
      const newData = this.issueTimeScheduleRepository.create(data);
      const savedData = await this.issueTimeScheduleRepository.save(newData);
      return convertDataResponse("Create Success", savedData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any, issue_ord_no: string) {
    const existingData = await this.issueTimeScheduleRepository.findOne({
      where: { issue_ord_no },
    });
    if (!existingData) {
      throw new HttpException(
        "Issue order number invalid",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.issueTimeScheduleRepository.update({ issue_ord_no }, data);
    const updatedData = await this.issueTimeScheduleRepository.findOne({
      where: { issue_ord_no },
    });
    return convertDataResponse("Update Success", updatedData);
  }

  async delete(issue_ord_no: string) {
    const existingData = await this.issueTimeScheduleRepository.findOne({
      where: { issue_ord_no },
    });
    if (!existingData) {
      throw new HttpException(
        "Issue order number invalid",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.issueTimeScheduleRepository.delete({ issue_ord_no });
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
              const existingSchedule =
                await this.issueTimeScheduleRepository.findOne({
                  where: { issue_ord_no: trimText(item.issue_ord_no) },
                });

              const scheduleData = {
                section_c: trimText(item.section_c),
                fact_c: trimText(item.fact_c),
                line_c: trimText(item.line_c),
                prod_no: trimText(item.prod_no),
                cusdesch_cd1: trimText(item.cusdesch_cd1),
                cusdesch_cd2: trimText(item.cusdesch_cd2),
                intdesch_cd: trimText(item.intdesch_cd),
                issue_ord_no: trimText(item.issue_ord_no),
                plan_issue_dt: item.plan_issue_dt
                  ? new Date(item.plan_issue_dt)
                  : null,
                A_reqd_time: item.A_reqd_time
                  ? new Date(item.A_reqd_time)
                  : null,
                time_issue: item.time_issue ? new Date(item.time_issue) : null,
                userid: trimText(item.userid) || "",
              };

              if (existingSchedule) {
                await this.issueTimeScheduleRepository.update(
                  { issue_ord_no: existingSchedule.issue_ord_no },
                  scheduleData,
                );
              } else {
                const newSchedule =
                  this.issueTimeScheduleRepository.create(scheduleData);
                await this.issueTimeScheduleRepository.save(newSchedule);
              }
            } catch (err) {
              listErrors.push({
                issue_ord_no: item.issue_ord_no,
                error: err.message,
              });
            }
          }),
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
