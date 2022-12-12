import fs from 'fs';
import path from 'path';
import json2csv from 'json2csv';
import crypto from 'crypto'

// type Admin = {
//   'LINE-NOTIFY': [
//     string: {
//       issueTimestamp: Date;
//     },
//   ];
// };

type User = {
  [
    /**
     * user 系統代碼
     * @example "-MBq9qzhBrVqOcgvR6v5"
     */
    record: string
  ]: {
    /**
     * 管理人員備註
     * @example "無"
     */
    adminNote?: string;

    /**
     * 備註
     * @example "無"
     */
    appendNote?: string;

    /**
     * 生日
     * @example "1984/09/10"
     */
    climberBirth: string;

    /**
     * 身分證字號
     * @example "xxxxxx"
     */
    climberId: string;

    /**
     * Line 號碼
     * @example "xxxxxx"
     */
    climberLine: string;

    /**
     * 姓名
     */
    climberName: string;

    /**
     * 電話號碼
     * @example "099999999"
     */
    climberPhone: string;

    /**
     * 一年攀高山、縱走次數
     * @example "0"
     */
    expHigh: string;

    /**
     * 一年攀中級山、郊山次數
     * @example "0"
     */
    expMedium: string;

    /**
     * 自覺體能狀況，介於 1 ~ 10
     * @example "7"
     */
    expPower: string;

    /**
     * 緊急聯絡人姓名
     */
    guardName: string;

    /**
     * 緊急聯絡人電話
     */
    guardPhone: string;

    /**
     * 行程代碼
     */
    tripId: string;
  };
};

type Trip = {
  [
    /**
     * 行程代碼
     * 版本不同的代碼可能行程資料內容會不一樣
     * @example "6KJF-8S6-CL9"
     * @example "T-1015-N9Y"
     */
    record: string
  ]: {
    /**
     * 建立時間
     * @example "2020-09-30 19:13:57"
     */
    createDatetime: string;

    /**
     * 延遲通報時間
     * @example "12"
     */
    delayHour: string;

    /**
     * 入山時間
     * @example "2020-09-30 19:13:57"
     */
    inDatetime: string;

    /**
     * 是否安全？
     * @example true
     */
    isSafe?: boolean;

    /**
     * 出山時間
     * @example "2020-09-30 19:13:57"
     */
    outDatetime: string;

    /**
     * 行程細節
     */
    pathDetail: string;

    /**
     * 行程名稱
     */
    pathName: string;

    /** 隊員 */
    members: User;
  };
};

type HikingGuard = {
  /** 使用者，使用者會重覆，每參加一次活動就會新增一次 */
  USER: User;
  /** 行程資料 */
  TRIP: Trip;
};

const dataSource = path.join('data', 'hiking-guard-export.json');
const hikingData = JSON.parse(fs.readFileSync(dataSource, { encoding: 'utf8' })) as HikingGuard;

function sha256(input:string):string{
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * 輸出：
 * - sha256(身分證字號)
 * - 生日
 * - 性別
 * - 行程代碼
 * - 入山/出山時間
 * - 行程名稱
 * - 行程內容
 */
const outputData = [];
for (const user in hikingData.USER) {
  const userData = hikingData.USER[user];

  // 找出該 trip
  const tripData = hikingData.TRIP[userData.tripId];

  // 判斷年齡
  const age = 2022 - Number(userData.climberBirth.slice(0, 4));

  // 判斷性別
  let gender: string;
  switch (userData.climberId[1]) {
    case '1':
      gender = '男';
      break;
    case '2':
      gender = '女';
      break;
    default:
      gender = '未知';
  }

  // 輸出格式
  outputData.push({
    "使用者 ID": sha256(userData.climberId),
    年齡: age,
    性別: gender,
    行程代碼: userData.tripId,
    入山時間: tripData.inDatetime,
    出山時間: tripData.outDatetime,
    行程名稱: tripData.pathName,
    行程細節: tripData.pathDetail,
  });
}

fs.writeFileSync(path.join(process.cwd(), 'data', 'output.csv'), json2csv.parse(outputData), 'utf8');
