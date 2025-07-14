import * as _ from "lodash";
import { Types } from "mongoose";

const convertIdToObjectMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

function removeFields(obj, fieldsToRemove) {
  const newObj = { ...obj };
  fieldsToRemove.forEach((field) => {
    delete newObj[field];
  });

  return newObj;
}

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

const findDocumentLatestWithDate = async (model, filter) => {
  return await model.findOne(filter).sort({ createdAt: -1 }).limit(1).exec();
};

const findDocumentWithOutboard = async (model, filter) => {
  const findLocationNearest = await model.find(filter).lean();
  if (
    !findLocationNearest[0] ||
    (findLocationNearest && findLocationNearest.length == 1)
  )
    return findLocationNearest[0] ? findLocationNearest[0] : {};
  const splitLocationToNumber = findLocationNearest.map((item) => {
    const { name, areaCode } = item;
    const length = name.length;
    const halfLength = Math.floor(length / 2);

    const firstHalf = name.substring(0, halfLength);
    const secondHalf = name.substring(halfLength);

    const numericPart = areaCode.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    const area = parseInt(numericPart, 10);

    return [firstHalf, secondHalf, area];
  });
  const checkNearest = [99, 99, 99];
  splitLocationToNumber.map((a) => {
    const [xx, yy, area] = a;
    if (+area < +checkNearest[2]) {
      checkNearest[0] = xx;
      checkNearest[1] = yy;
      checkNearest[2] = area;
      return 0;
    } else if (+area > +checkNearest[2]) {
      return 0;
    }

    if (+xx < +checkNearest[0]) {
      checkNearest[0] = xx;
      checkNearest[1] = yy;
      return 0;
    }
    if (+xx == +checkNearest[0] && +yy < +checkNearest[1]) {
      checkNearest[0] = xx;
      checkNearest[1] = yy;
    }
    return 0;
  });
  const [x, y] = checkNearest;
  return findLocationNearest.find((item) => item?.name == [x, y].join(""));
};

const findDocumentWithInboard = async (model, filter) => {
  const findLocationNearest = await model.find(filter).lean();
  if (
    !findLocationNearest[0] ||
    (findLocationNearest && findLocationNearest.length == 1)
  )
    return findLocationNearest[0] ? findLocationNearest[0] : {};
  const splitLocationToNumber = findLocationNearest.map((item) => {
    const { name } = item;
    const length = name.length;
    const halfLength = Math.floor(length / 2);

    const firstHalf = name.substring(0, halfLength);
    const secondHalf = name.substring(halfLength);

    return [firstHalf, secondHalf];
  });
  const checkNearest = [0, 0];
  splitLocationToNumber.map((a) => {
    const [xx, yy] = a;
    if (+xx > +checkNearest[0]) {
      checkNearest[0] = xx;
      checkNearest[1] = yy;
      return 0;
    }
    if (+xx == +checkNearest[0] && +yy > +checkNearest[1]) {
      checkNearest[0] = xx;
      checkNearest[1] = yy;
    }
    return 0;
  });
  return findLocationNearest.find(
    (item) => item?.name == checkNearest.join(""),
  );
};

const findDocumentOldestWithDate = async (model, filter) => {
  return await model.findOne(filter).sort({ createdAt: 1 }).limit(1).exec();
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

export {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertIdToObjectMongodb,
  findDocumentLatestWithDate,
  findDocumentOldestWithDate,
  removeFields,
  findDocumentWithInboard,
  findDocumentWithOutboard,
};
