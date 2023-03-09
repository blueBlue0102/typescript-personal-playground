import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function exportJsonFile(data: any[]) {
  const jsonStringify = JSON.stringify(data);
  fs.writeFileSync(path.join('data', 'output.json'), jsonStringify, 'utf-8');
}

export enum ClassificationDataStatusEnum {
  /** 0: 待確認 */
  Uncertain = 'Uncertain',
  /** 1: 暫存中 */
  Temporary = 'Temporary',
  /** 2: 已確認 */
  Confirmed = 'Confirmed',
  /** 3: 訓練中 */
  Training = 'Training',
  /** 4: 已訓練 */
  Trained = 'Trained',
}

function getNumberStatus(value: ClassificationDataStatusEnum): number {
  switch (value) {
    case ClassificationDataStatusEnum.Uncertain:
      return 0;
    case ClassificationDataStatusEnum.Temporary:
      return 1;
    case ClassificationDataStatusEnum.Confirmed:
      return 2;
    case ClassificationDataStatusEnum.Training:
      return 3;
    case ClassificationDataStatusEnum.Trained:
      return 4;
    default:
      throw new Error(`試圖轉換不存在的狀態: ${value}`);
  }
}

interface ClassificationData {
  /**
   * 所屬的 Dataset\
   * 寫入 DB 時須為 ObjectId，透過 model service 取得時，須為對應的 string
   * @example ObjectId(758be759-76ef-4653-928f-21b8700a0062)
   */
  datasetId: { $oid: string };

  /**
   * 資料內容
   * @example "依據 貴局在108/07/11  保局（綜）字"
   */
  content: string;

  /**
   * 所屬的分類 \
   * 若值為 null，即表示"尚未分類"\
   * 若有值，寫入 DB 時須為 ObjectId，透過 model service 取得時，須為對應的 string
   */
  categoryId: { $oid: string };

  /**
   * 資料的狀態 \
   * 儲存在資料庫時會透過 setter 轉換成數字，取出時會透過 getter 自動轉換為 string：
   * - 0: 待確認(Uncertain)
   * - 1: 暫存中(Temporary)
   * - 2: 已確認(Confirmed)
   * - 3: 訓練中(Training)
   * - 4: 已訓練(Trained)
   * @example "Confirmed"
   */
  status: number;

  /**
   * 信心值 \
   * 訓練後，資料會有信心值 \
   * 數值介於 0 ~ 1 \
   * 可能為 null，表示尚未訓練
   * @example 0.5
   */
  score: number | null;

  /**
   * 是否為訓練集 \
   * 若為 false 則為驗證集 \
   * 沒有值則尚未分類
   */
  isTrainingSet?: boolean;
}

function generateClassificationData(
  count: number,
  data: {
    datasetId: string;
    categoryId: string;
  },
): ClassificationData[] {
  const output: ClassificationData[] = [];
  for (let i = 0; i < count; i++) {
    output.push({
      datasetId: { $oid: data.datasetId },
      content: crypto.randomUUID(),
      categoryId: { $oid: data.categoryId },
      status: getNumberStatus(ClassificationDataStatusEnum.Confirmed),
      score: null,
      isTrainingSet: null,
    });
  }
  return output;
}

exportJsonFile(
  generateClassificationData(100, {
    datasetId: '63f7046b922b48764fa5dee4',
    categoryId: '640996a8f7207a023083ac00',
  }),
);
