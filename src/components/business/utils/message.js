class Message {
  constructor(text, interpolation) {
    this.text = text
    this.interpolation = interpolation
  }

  replace(...string) {

  }
}

const MESSAGES = {
  SELECT: {
    LEAST_ONE: '请至少选中一项数据！',
    LEAST_ONE_T: '请至少选中一项{1}！',
  },
}

export default MESSAGES
