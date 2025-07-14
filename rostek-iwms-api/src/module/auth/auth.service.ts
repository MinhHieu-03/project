import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  UpdateUserPasswordDto,
} from "src/dtos/CreateUser.dto";
import { Account } from "src/shemas/account.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { getInfoData } from "../../ultil/convert_data";
import { AUTH_ERRORS, AuthError } from "../../helpers/error.constants";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private userModel: Model<Account>,
    private jwtService: JwtService,
  ) { }

  async getAll() {
    const data = await this.userModel.find().select(["role", "name", "_id"]);
    return convertDataResponse("OK", data);
  }

  async getUserByFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.userModel);
  }

  async getById(id: any) {
    try {
      const data = await this.userModel.findById(id);
      if (!data) {
        const error = new AuthError(AUTH_ERRORS.INVALID_USER_ID, {
          userId: id,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return convertDataResponse(
        "Ok",
        getInfoData({
          fields: ["role", "name", "_id"],
          object: data,
        }),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const authError = new AuthError(AUTH_ERRORS.VALIDATION_ERROR, {
        originalError: error.message,
        userId: id,
      });
      throw new HttpException(
        {
          code: authError.code,
          message: authError.message,
          reason: authError.reason,
          details: authError.details,
          timestamp: authError.timestamp,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async createUser(userData: CreateUserDto) {
    try {
      const { name, password, role } = userData;
      const holderShop = await this.userModel.findOne({ name }).lean();
      if (holderShop) {
        const error = new AuthError(AUTH_ERRORS.ACCOUNT_ALREADY_EXISTS, {
          username: name,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let passwordHash: string;
      try {
        passwordHash = await bcrypt.hash(password, 10);
      } catch (hashError) {
        const error = new AuthError(AUTH_ERRORS.PASSWORD_HASH_FAILED, {
          originalError: hashError.message,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newAccount = await this.userModel.create({
        ...userData,
        name,
        password: passwordHash,
        role,
      });

      if (newAccount) {
        let access_token: string;
        try {
          access_token = await this.jwtService.signAsync({ name, role });
        } catch (tokenError) {
          const error = new AuthError(AUTH_ERRORS.TOKEN_GENERATION_FAILED, {
            originalError: tokenError.message,
            username: name,
          });
          throw new HttpException(
            {
              code: error.code,
              message: tokenError.message,
              reason: error.reason,
              details: error.details,
              timestamp: error.timestamp,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return convertDataResponse("Create User Success", {
          user: getInfoData({
            fields: ["role", "name", "_id", "describe"],
            object: newAccount,
          }),
          access_token,
        });
      } else {
        const error = new AuthError(AUTH_ERRORS.CREATE_USER_FAILED, {
          userData: { name, role },
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const authError = new AuthError(AUTH_ERRORS.CREATE_USER_FAILED, {
        originalError: error.message,
        userData: userData,
      });
      throw new HttpException(
        {
          code: {
            statusCode: 404,
            message: {
              code: "AUTH_001",
              message: "Account not found",
              reason: "The specified user account does not exist in the system",
              details: { username: "john_doe" },
              timestamp: "2025-06-17T10:30:00.000Z",
            },
          },
          message: authError.message,
          reason: authError.reason,
          details: authError.details,
          timestamp: authError.timestamp,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(userData: UpdateUserDto, id: string) {
    try {
      const dataUpdate = await this.userModel.findByIdAndUpdate(id, userData, {
        new: true,
      });
      if (!dataUpdate) {
        const error = new AuthError(AUTH_ERRORS.INVALID_USER_ID, {
          userId: id,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return convertDataResponse("Update Success", dataUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          code: 500,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUserPassword(userData: UpdateUserPasswordDto, id: string) {
    try {
      let passwordHash: string;
      try {
        passwordHash = await bcrypt.hash(userData.password, 10);
      } catch (hashError) {
        const error = new AuthError(AUTH_ERRORS.PASSWORD_HASH_FAILED, {
          originalError: hashError.message,
          userId: id,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const dataUpdate = await this.userModel.findByIdAndUpdate(
        id,
        {
          password: passwordHash,
        },
        {
          new: true,
        },
      );

      if (!dataUpdate) {
        const error = new AuthError(AUTH_ERRORS.INVALID_USER_ID, {
          userId: id,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return convertDataResponse("Update Password Success", dataUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const authError = new AuthError(AUTH_ERRORS.UPDATE_USER_FAILED, {
        originalError: error.message,
        userId: id,
      });
      throw new HttpException(
        {
          code: authError.code,
          message: authError.message,
          reason: authError.reason,
          details: authError.details,
          timestamp: authError.timestamp,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(userData: LoginDto) {
    try {
      const { name, password } = userData;
      const foundShop = await this.userModel.findOne({ name });
      if (!foundShop) {
        const error = new AuthError(AUTH_ERRORS.ACCOUNT_NOT_FOUND, {
          username: name,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const match = await bcrypt.compare(password, foundShop.password);
      if (!match) {
        const error = new AuthError(AUTH_ERRORS.INVALID_PASSWORD, {
          username: name,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let access_token: string;
      try {
        access_token = await this.jwtService.signAsync({
          name: foundShop.name,
          role: foundShop.role,
        });
      } catch (tokenError) {
        const error = new AuthError(AUTH_ERRORS.TOKEN_GENERATION_FAILED, {
          originalError: tokenError.message,
          username: name,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await foundShop.updateOne({ recent_access: Date.now() });
      return convertDataResponse("Login Success", {
        user: getInfoData({
          fields: ["role", "name", "_id", "describe"],
          object: foundShop,
        }),
        access_token,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const authError = new AuthError(AUTH_ERRORS.VALIDATION_ERROR, {
        originalError: error.message,
        userData: userData,
      });
      throw new HttpException(
        {
          code: authError.code,
          message: authError.message,
          reason: authError.reason,
          details: authError.details,
          timestamp: authError.timestamp,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const deleteSuccess = await this.userModel.findByIdAndDelete(id);
      if (!deleteSuccess) {
        const error = new AuthError(AUTH_ERRORS.INVALID_USER_ID, {
          userId: id,
        });
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
            reason: error.reason,
            details: error.details,
            timestamp: error.timestamp,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        msg: "Delete Account Success",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const authError = new AuthError(AUTH_ERRORS.DELETE_USER_FAILED, {
        originalError: error.message,
        userId: id,
      });
      throw new HttpException(
        {
          code: authError.code,
          message: authError.message,
          reason: authError.reason,
          details: authError.details,
          timestamp: authError.timestamp,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
