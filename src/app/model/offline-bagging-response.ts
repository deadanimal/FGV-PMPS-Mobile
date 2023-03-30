import { BaggingModel } from "./bagging";
import { ControlPollinationModel } from "./control-pollination";
import { DefectModel } from "./defect";
import { PokokResponse } from "./pokok-respons";
import { PollenPreparationModel } from "./pollen-preparation-model";
import { TandanResponse } from "./tandan-response";
import { User } from "./user";

export interface OfflineBaggingResponseModel {
    bagging?:BaggingModel[];
    tandan:TandanResponse[];
    pokok:PokokResponse[];
    user:User[];
    newCP:BaggingModel[];
    posponedCP:ControlPollinationModel[];
    kerosakan:DefectModel[];
    pollen:PollenPreparationModel[];
}
