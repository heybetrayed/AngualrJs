export class AccessFactorData {
    aFDResult: string;

    aFDCaption: string;

    aFDSupportFile: string;

    aFDReporter: string;

    aFDScore: number;

    aFDWeights: number;

    assessModuleId: number;

    assessTypeId: number;

    assessFactorId: number;

    aesTaskId: number;


    constructor(aFDResult: string, aFDCaption: string, aFDSupportFile: string, aFDReporter: string, aFDScore: number, aFDWeights: number, assessModuleId: number, assessTypeId: number, assessFactorId: number, aesTaskId: number) {
        this.aFDResult = aFDResult;
        this.aFDCaption = aFDCaption;
        this.aFDSupportFile = aFDSupportFile;
        this.aFDReporter = aFDReporter;
        this.aFDScore = aFDScore;
        this.aFDWeights = aFDWeights;
        this.assessModuleId = assessModuleId;
        this.assessTypeId = assessTypeId;
        this.assessFactorId = assessFactorId;
        this.aesTaskId = aesTaskId;
    }
}