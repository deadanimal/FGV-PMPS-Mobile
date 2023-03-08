import { BaggingModel } from "./bagging";
import { PokokResponse } from "./pokok-respons";
import { TandanResponse } from "./tandan-response";
import { User } from "./user";

export interface OfflineBaggingResponseModel {
    bagging?:BaggingModel[];
    tandan:TandanResponse[];
    pokok:PokokResponse[];
    user:User[];
}
