import { createMachine } from 'xstate';

const States = {
  None: '無',
  Uploading: {
    Running: '語料上傳中',
    Success: '語料上傳成功',
    Failure: '語料上傳失敗',
  },
  Analyzing: {
    Running: '跑分中',
    Pausing: '跑分暫停中',
    Paused: '跑分暫停完成',
    Aborting: '跑分終止中',
    Aborted: '跑分終止完成',
    Success: '跑分成功',
    Failure: '跑分失敗',
  },
};

const Events = {
  Upload: '上傳語料',
  UploadSuccess: '上傳語料成功',
  UploadFailure: '上傳語料失敗',
  UploadTimeout: '上傳語料 timeout',
  Analysis: '開始跑分',
  AnalysisSuccess: '跑分成功',
  AnalysisFailure: '跑分失敗',
  AnalysisTimeout: '跑分 timeout',
  PauseAnalysis: '暫停跑分',
  PauseAnalysisSuccess: '暫停跑分成功',
  PauseAnalysisTimeout: '暫停跑分 timeout',
  AbortAnalysis: '終止跑分',
  AbortAnalysisSuccess: '終止跑分成功',
  AbortAnalysisTimeout: '終止跑分 timeout',
  ContinueAnalysis: '繼續跑分',
  UpdateUploadingInfo: '更新上傳進度',
  UpdateAnalyzingInfo: '更新跑分進度',
};

const beanAppMachine = createMachine({
  id: 'BEAN app',
  initial: States.None,
  states: {
    [States.None]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
      },
    },
    [States.Uploading.Running]: {
      on: {
        [Events.UpdateUploadingInfo]: {
          target: States.Uploading.Running,
        },
        [Events.UploadSuccess]: {
          target: States.Uploading.Success,
        },
        [Events.UploadFailure]: {
          target: States.Uploading.Failure,
        },
        [Events.UploadTimeout]: {
          target: States.Uploading.Failure,
        },
      },
    },
    [States.Uploading.Success]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
        [Events.Analysis]: {
          target: States.Analyzing.Running,
        },
      },
    },
    [States.Uploading.Failure]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
        [Events.Analysis]: {
          target: States.Analyzing.Running,
        },
      },
    },
    [States.Analyzing.Running]: {
      on: {
        [Events.UpdateAnalyzingInfo]: {
          target: States.Analyzing.Running,
        },
        [Events.PauseAnalysis]: {
          target: States.Analyzing.Pausing,
        },
        [Events.AbortAnalysis]: {
          target: States.Analyzing.Aborting,
        },
        [Events.AnalysisSuccess]: {
          target: States.Analyzing.Success,
        },
        [Events.AnalysisTimeout]: {
          target: States.Analyzing.Paused,
        },
      },
    },
    [States.Analyzing.Pausing]: {
      on: {
        [Events.PauseAnalysisSuccess]: {
          target: States.Analyzing.Paused,
        },
        [Events.PauseAnalysisTimeout]: {
          target: States.Analyzing.Paused,
        },
      },
    },
    [States.Analyzing.Aborting]: {
      on: {
        [Events.AbortAnalysisSuccess]: {
          target: States.Analyzing.Aborted,
        },
        [Events.AbortAnalysisTimeout]: {
          target: States.Analyzing.Aborted,
        },
      },
    },
    [States.Analyzing.Success]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
        [Events.Analysis]: {
          target: States.Analyzing.Running,
        },
      },
    },
    [States.Analyzing.Failure]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
        [Events.Analysis]: {
          target: States.Analyzing.Running,
        },
      },
    },
    [States.Analyzing.Paused]: {
      on: {
        [Events.ContinueAnalysis]: {
          target: States.Analyzing.Running,
        },
        [Events.AbortAnalysis]: {
          target: States.Analyzing.Aborted,
        },
      },
    },
    [States.Analyzing.Aborted]: {
      on: {
        [Events.Upload]: {
          target: States.Uploading.Running,
        },
        [Events.Analysis]: {
          target: States.Analyzing.Running,
        },
      },
    },
  },
});
