const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

/* ====================== AI 知识库 ====================== */
const KNOWLEDGE_BASE = {
  瓷贴片是什么: '瓷贴片是一种超薄的瓷质修复体（厚度约0.2-0.5mm），像隐形眼镜一样薄，粘贴在牙齿表面来改善颜色、形状、大小和对齐度。采用德国VITA全瓷材料制作，透光性与天然牙釉质几乎一致。',
  什么是瓷贴片: '瓷贴片是一种超薄的瓷质修复体（厚度约0.2-0.5mm），像隐形眼镜一样薄，粘贴在牙齿表面来改善颜色、形状、大小和对齐度。采用德国VITA全瓷材料制作，透光性与天然牙釉质几乎一致。',
  多少钱: '瓷贴片的价格因人而异，取决于您的牙齿状况、需要的颗数以及选择的方案。\n\n我们提供免费面诊，医生会根据您的实际情况制定专属方案并给出详细报价。没有任何隐性消费，支持分期付款。\n\n📅 点击"预约面诊"预约免费咨询吧！',
  价格: '瓷贴片的价格因人而异，需要面诊评估后才能给出准确报价。\n\n首次面诊完全免费（约30分钟），医生会检查您的牙齿状况，制定个性化方案并详细说明费用。无隐性消费，支持分期付款。\n\n📅 建议预约免费面诊获取专属报价！',
  疼: '整个过程基本无痛！牙面微量预备时可能会有轻微酸感，但绝大多数人不需要麻药即可完成。敏感牙齿可使用表面麻醉，全程舒适。',
  痛: '整个过程基本无痛！牙面微量预备时可能会有轻微酸感，但绝大多数人不需要麻药即可完成。敏感牙齿可使用表面麻醉，全程舒适。',
  磨牙: '瓷贴片是微创技术，大多数情况仅需在牙釉质表面做0.2-0.5mm微量预备（约指甲厚度一半），有时甚至完全不需要磨牙。',
  维持: '正确维护下瓷贴片可使用10-15年甚至更久！全瓷材料本身不会变色，需注意口腔卫生、定期洁牙，避免咬过硬食物。',
  维护: '日常维护简单：正常刷牙、使用牙线即可。建议每半年至一年做一次专业洁牙和贴片检查。',
  流程: '整个流程4步：\n1️⃣ 初次面诊（约30分钟）：一对一沟通检查\n2️⃣ 数字化设计（约1周）：3D扫描定制方案\n3️⃣ 贴片制作与试戴（约1-2周）：手工精制微调\n4️⃣ 粘接完成（约1-2小时）：即刻拥有新笑容',
  预约: '预约很简单！\n• 在网站点击"预约面诊"填写表单\n• 拨打 13976387730\n• 微信：WUFAER473700385\n\n预约后24小时内电话确认，首次面诊免费！',
  面诊: '首次面诊完全免费（约30分钟），包括口腔检查、拍照、取模、需求沟通和方案介绍。无任何消费压力。',
  适合: '大部分人都适合。但严重蛀牙需先补牙、重度牙周病需先治疗、严重牙齿排列不齐建议先矫正。免费面诊做全面评估。',
  区别: '瓷贴片在美观度、耐用性和生物相容性上远优于树脂贴面。相比烤瓷牙，磨牙量极少。比喻：瓷贴片是"给牙齿做美甲"，烤瓷牙是"给牙齿戴帽子"。',
  烤瓷牙: '瓷贴片在美观度、耐用性和生物相容性上远优于树脂贴面。相比烤瓷牙，磨牙量极少，能最大程度保留健康牙体。',
  变色: '全瓷材料本身不会变色！高密度瓷面经过专业抛光，不易吸附咖啡、茶渍等色素。',
  时间: '从初诊到戴上贴片通常2-3次就诊，整个过程约2-3周。单次粘接操作约1-2小时即可完成。',
  地址: '海南省海口市美兰区瓦灶路3号 碧桂园·美舍仕家2栋201。\n\n营业时间：周一至周五 9:00-18:00，周六 9:00-17:00，周日休息。\n联系电话：13976387730\n微信：WUFAER473700385',
  在哪: '海南省海口市美兰区瓦灶路3号 碧桂园·美舍仕家2栋201。联系电话：13976387730',
  保险: '瓷贴片属美容牙科项目，医保暂不覆盖。我们支持多种支付方式：现金、银行卡、微信、支付宝，还支持分期付款。',
  年龄: '18岁以上成年人都适合。无严格年龄上限，只要口腔健康状况良好即可。',
  失败: '瓷贴片技术已非常成熟，失败率极低。如有脱落崩裂等情况，保修期内免费维护修复。',
  材料: '采用德国VITA全瓷材料，全球顶级牙科陶瓷品牌。生物相容性极佳，透光性与天然牙釉质几乎完全一致。',
};

function aiReply(question) {
  const q = question.toLowerCase().trim();
  for (const [k, v] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(k)) return v;
  }
  return '感谢您的咨询！建议预约免费面诊让专业医生为您详细解答。\n\n📞 电话：13976387730\n💬 微信：WUFAER473700385\n📅 在网站点击"预约面诊"在线预约\n\n还有其他问题吗？😊';
}

/* ====================== 客户 API ====================== */

// POST /api/chat/session — get or create a session (no welcome message until first user message)
router.post('/session', (req, res) => {
  const db = getDB();
  const { sessionKey } = req.body;
  if (!sessionKey) return res.status(400).json({ error: 'Missing sessionKey' });

  let session = db.prepare("SELECT * FROM chat_sessions WHERE session_key = ? AND deleted = 0").get(sessionKey);
  if (!session) {
    // Don't create the session yet - just return a temp ID. Session created on first message.
    const result = db.prepare('INSERT INTO chat_sessions (session_key) VALUES (?)').run(sessionKey);
    session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(result.lastInsertRowid);
  }
  res.json({ session });
});

// GET /api/chat/session/:id/messages — poll messages
router.get('/session/:id/messages', (req, res) => {
  const db = getDB();
  const { since } = req.query;
  let messages;
  if (since) {
    messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? AND id > ? ORDER BY id ASC').all(req.params.id, Number(since));
  } else {
    messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC').all(req.params.id);
  }
  const session = db.prepare('SELECT status, agent_name FROM chat_sessions WHERE id = ?').get(req.params.id);
  res.json({ messages, sessionStatus: session?.status, agentName: session?.agent_name });
});

// POST /api/chat/session/:id/messages — customer sends message
router.post('/session/:id/messages', (req, res) => {
  const db = getDB();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  let session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // If this is the first message in this session, add welcome message
  const msgCount = db.prepare('SELECT COUNT(*) as c FROM chat_messages WHERE session_id = ?').get(req.params.id);
  if (msgCount.c === 0) {
    db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
      req.params.id, 'bot', '您好！我是臻白瓷贴片智能客服小美 💎\n\n可以帮您解答各种瓷贴片问题，请问想了解什么？'
    );
  }

  // Save user message
  const userMsg = db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
    req.params.id, 'user', text
  );
  db.prepare("UPDATE chat_sessions SET updated_at = datetime('now'), deleted = 0 WHERE id = ?").run(req.params.id);

  // If AI mode, auto-reply
  if (session.status === 'ai') {
    const reply = aiReply(text);
    db.prepare('INSERT INTO chat_messages (session_id, role, text) VALUES (?, ?, ?)').run(
      req.params.id, 'bot', reply
    );
    db.prepare("UPDATE chat_sessions SET unread = unread + 1, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  } else {
    // Agent mode: mark unread for agent
    db.prepare("UPDATE chat_sessions SET unread = 1, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  }

  res.json({ userMessage: { id: userMsg.lastInsertRowid, role: 'user', text } });
});

module.exports = router;
