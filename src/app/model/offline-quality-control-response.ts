import { DefectModel } from "./defect";
import { PokokResponse } from "./pokok-respons";
import { QualityControlModel } from "./quality-control";
import { TandanResponse } from "./tandan-response";
import { User } from "./user";

export interface OfflineQCResponseModel {
    QC?:QualityControlModel[];
    korosakans:DefectModel[];
    newQc:QualityControlModel[];
    penyeliakk:User[];
    tandans:TandanResponse[];
    pokoks:PokokResponse[];
}
