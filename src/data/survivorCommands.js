export const phase1Pool = {
    // 10% Chance - Guaranteed Survival
    safe: [
        { text: "รอดตัวไป! รอบนี้ไม่มีใครตาย", type: "survive" },
        { text: "โชคดีสุดๆ! คุณรอดและเลือกเพื่อนดื่ม 1 ช็อต", type: "survive" }
    ],
    // 20% Chance - Guaranteed Death
    death: [
        { text: "เสียใจด้วย คุณตกรอบทันที!", type: "eliminate" },
        { text: "โดนสุ่มออก! เก็บของกลับบ้านได้เลย", type: "eliminate" },
        { text: "แจ็คพอตแตก! คุณคือผู้โชคร้าย (ตกรอบ)", type: "eliminate" },
        { text: "Game Over! ขอเชิญออกจากวง", type: "eliminate" }
    ],
    // 70% Chance - Risk / Conditional
    risk: [
        { text: "ใครใส่เสื้อสีดำ (หรือดำเป็นส่วนใหญ่)", type: "risk" },
        { text: "ใครใส่เสื้อสีขาว (หรือขาวเป็นส่วนใหญ่)", type: "risk" },
        { text: "ใครใช้ iPhone", type: "risk" },
        { text: "ใครใช้มือถือยี่ห้ออื่น (Samsung, Oppo, Vivo ฯลฯ)", type: "risk" },
        { text: "ใครสวมแว่นสายตาอยู่ตอนนี้", type: "risk" },
        { text: "ใคร \"ไม่\" ได้ใส่นาฬิกาข้อมือมางาน", type: "risk" },
        { text: "ใครใส่กางเกงยีนส์ (สีไหนก็ได้)", type: "risk" },
        { text: "ใครใส่รองเท้าผ้าใบ", type: "risk" },
        { text: "ใครสวมแหวนที่นิ้วนาง (ข้างไหนก็ได้)", type: "risk" },
        { text: "ใครแบตมือถือเหลือ น้อยกว่า 50% (เปิดโชว์เพื่อน)", type: "risk" },
        { text: "ใครมีแอป TikTok อยู่หน้าแรกของมือถือ", type: "risk" },
        { text: "ใครมีแบงค์ 1,000 ในกระเป๋าตังค์", type: "risk" },
        { text: "ใครผมไม่ใช่สีดำธรรมชาติ", type: "risk" },
        { text: "ใครมีแอปธนาคารในเครื่องมากกว่า 2 แอป", type: "risk" }
    ]
};

export const phase2Pool = [
    { text: "ถ้าเคสมือถือคุณ ไม่ใช่สีใส", type: "risk" },
    { text: "ถ้ามีแชทที่ยังไม่ได้อ่านเกิน 10 แชท", type: "risk" },
    { text: "ถ้ามีบัตร All Member หรือบัตรสมาชิกใดๆ ในกระเป๋า", type: "risk" },
    { text: "ถ้ารูปโปรไฟล์โซเชียล ไม่ใช่รูปหน้าตัวเอง", type: "risk" },
    { text: "ถ้าคุณสูงเกิน 175 ซม.", type: "risk" },
    { text: "ถ้าวันที่เกิดเป็น เลขคู่", type: "risk" },
    { text: "ถ้าเลขตัวสุดท้ายของเบอร์คุณคือ 0, 1, หรือ 2", type: "risk" },
    { text: "ถ้ามีแบงค์ 20 ในกระเป๋ามากกว่า 2 ใบ", type: "risk" },
    { text: "ถ้าเสื้อที่ใส่ตอนนี้มีกระดุม", type: "risk" },
    { text: "ถ้ามีรอยสัก (ที่โชว์เพื่อนได้)", type: "risk" }
];
