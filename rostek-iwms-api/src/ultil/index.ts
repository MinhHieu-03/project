import { UnauthorizedException } from "@nestjs/common";
import * as moment from "moment";

export const convertDataResponse = (
  msg = "OK",
  metaData: any,
  total?: number,
  limit?: number,
  page?: number,
) => {
  return {
    msg,
    metaData: metaData || [],
    ...(limit ? { limit } : {}),
    ...(page ? { page } : {}),
    ...(total ? { total } : {}),
  };
};

export const FilterDataResponse = async (body, repo, msg = "Ok", populate = []) => {
  const { limit = 10, sort = "ctime", page = 1, filter = {} } = body;
  const { createdAt, ...filterDoc } = filter;
  const skip = (+page - 1) * +limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const filterParams = {
    ...filterDoc,
    ...(createdAt
      ? {
        createdAt: {
          $gte: moment(createdAt),
          $lte: moment(createdAt).add(1, "d"),
        },
      }
      : {}),
  };
  const [data, total] = await Promise.all([
    repo
      .find(filterParams)
      .sort(sortBy)
      .skip(skip)
      .limit(+limit)
      .select("-password")
      .populate(populate)
      .lean(),
    repo.countDocuments(filterParams),
  ]);
  return convertDataResponse(msg, data, total, limit, page);
};
