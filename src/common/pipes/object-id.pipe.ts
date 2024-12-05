import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid ObjectId: ${value}`);
    }
    return value;
  }
}