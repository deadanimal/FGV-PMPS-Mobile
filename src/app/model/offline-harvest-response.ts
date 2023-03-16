import { DefectModel } from "./defect";
import { HarvestModel } from "./harvest";
import { PokokResponse } from "./pokok-respons";
import { TandanResponse } from "./tandan-response";
import { User } from "./user";

export interface OfflineHarvestResponseModel {
    harvest?:HarvestModel[];
    korosakans:DefectModel[];
    newHarvest:HarvestModel[];
    penyeliakk:User[];
    tandans:TandanResponse[];
    pokoks:PokokResponse[];
}
