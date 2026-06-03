/**
 * 短信服务模块
 * 上线时填入 SMS_* 配置即可切换为真实短信
 */

// ========== 上线时修改这里 ==========
const SMS_PROVIDER = 'dev'; // 'dev' | 'aliyun' | 'tencent'
const SMS_CONFIG = {
  aliyun: {
    accessKeyId: '',
    accessKeySecret: '',
    signName: '臻白瓷贴片',
    templateCode: 'SMS_XXXXXXXXX',
  },
  tencent: {
    appId: '',
    appKey: '',
    signName: '臻白瓷贴片',
    templateId: '',
  },
};
// ====================================

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSMS(phone, code) {
  if (SMS_PROVIDER === 'dev') {
    console.log(`[DEV SMS] ${phone} 验证码: ${code}`);
    return { success: true, code }; // 开发模式返回code给前端自动填入
  }

  if (SMS_PROVIDER === 'aliyun') {
    // 阿里云短信 - 上线后取消注释
    // const Core = require('@alicloud/pop-core');
    // const client = new Core({ ... });
    // await client.request('SendSms', { PhoneNumbers: phone, SignName: SMS_CONFIG.aliyun.signName, TemplateCode: SMS_CONFIG.aliyun.templateCode, TemplateParam: JSON.stringify({ code }) });
    console.log(`[ALIYUN SMS] ${phone} 验证码: ${code}`);
    return { success: true };
  }

  if (SMS_PROVIDER === 'tencent') {
    // 腾讯云短信 - 上线后取消注释
    // const tencentcloud = require('tencentcloud-sdk-nodejs');
    // const client = new tencentcloud.sms.v20210111.Client({ ... });
    // await client.SendSms({ PhoneNumberSet: [phone], SignName: SMS_CONFIG.tencent.signName, TemplateId: SMS_CONFIG.tencent.templateId, TemplateParamSet: [code] });
    console.log(`[TENCENT SMS] ${phone} 验证码: ${code}`);
    return { success: true };
  }

  throw new Error('SMS provider not configured');
}

module.exports = { sendSMS, generateCode };
