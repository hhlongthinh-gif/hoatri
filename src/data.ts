import { ChemicalItem, Achievement } from './types';

export const ELEMENTS_DATA: ChemicalItem[] = [
  {
    id: 'h',
    name: 'Hiđrô',
    symbol: 'H',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Phi kim',
    description: 'Nguyên tố nhẹ nhất vũ trụ, luôn có hóa trị I trong các hợp chất thông thường.',
    chemistryTip: 'Kali, Iốt, Natri với Bạc, Clo một loài là hóa trị I cô ơi!'
  },
  {
    id: 'li',
    name: 'Liti',
    symbol: 'Li',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Kim loại kiềm',
    description: 'Kim loại nhẹ nhất, thuộc nhóm IA, có hóa trị I đặc trưng.',
    chemistryTip: 'Liti cùng nhóm với Natri và Kali nên mang hóa trị I.'
  },
  {
    id: 'na',
    name: 'Natri',
    symbol: 'Na',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Kim loại kiềm',
    description: 'Cháy với ngọn lửa màu vàng đặc trưng, hóa trị I duy nhất.',
    chemistryTip: 'Natri hóa trị I, gặp nước phản ứng sủi bọt mãnh liệt.'
  },
  {
    id: 'k',
    name: 'Kali',
    symbol: 'K',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Kim loại kiềm',
    description: 'Kim loại kiềm cực kỳ hoạt động, hóa trị I.',
    chemistryTip: 'Kali nằm ở đầu bài ca hóa trị của chúng ta, hóa trị I.'
  },
  {
    id: 'ag',
    name: 'Bạc',
    symbol: 'Ag',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Kim loại',
    description: 'Kim loại dẫn điện và nhiệt tốt nhất, có hóa trị I.',
    chemistryTip: 'Bạc trắng lấp lánh kết tủa AgCl màu trắng tinh khôi, hóa trị I.'
  },
  {
    id: 'cl',
    name: 'Clo',
    symbol: 'Cl',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Halogen',
    description: 'Chất khí màu vàng lục, trong muối clorua mang hóa trị I.',
    chemistryTip: 'Clo trong muối axit mạnh luôn mang hóa trị I.'
  },
  {
    id: 'f',
    name: 'Flo',
    symbol: 'F',
    valences: [1],
    type: 'element',
    valenceText: 'I',
    category: 'Halogen',
    description: 'Phi kim phi thường hoạt động, độ âm điện lớn nhất, luôn là hóa trị I.',
    chemistryTip: 'Flo là nữ hoàng độ âm điện, chỉ có duy nhất hóa trị I.'
  },
  {
    id: 'o',
    name: 'Oxi',
    symbol: 'O',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Phi kim',
    description: 'Duy trì sự sống và sự cháy, luôn lấy hóa trị II làm chuẩn mực so sánh.',
    chemistryTip: 'Oxi hóa trị II quen thuộc, làm chuẩn để tính hóa trị nguyên tố khác.'
  },
  {
    id: 'mg',
    name: 'Magiê',
    symbol: 'Mg',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Kim loại kiềm thổ',
    description: 'Cháy trong không khí tạo ra ánh sáng trắng lóa mắt, hóa trị II.',
    chemistryTip: 'Magiê thuộc nhóm IIA, có hóa trị II cố định.'
  },
  {
    id: 'ca',
    name: 'Canxi',
    symbol: 'Ca',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Kim loại kiềm thổ',
    description: 'Thành phần cấu tạo nên xương, răng và vỏ sò, hóa trị II.',
    chemistryTip: 'Canxi hóa trị II, giúp xương chắc khỏe và dẻo dai.'
  },
  {
    id: 'ba',
    name: 'Bari',
    symbol: 'Ba',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Kim loại kiềm thổ',
    description: 'Muối sunfat BaSO₄ của nó kết tủa trắng tinh không tan trong axit mạnh, hóa trị II.',
    chemistryTip: 'Bari hóa trị II, tạo kết tủa trắng đẹp đẽ với nhóm Sunfat (SO₄).'
  },
  {
    id: 'zn',
    name: 'Kẽm',
    symbol: 'Zn',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Kim loại',
    description: 'Kim loại chống rỉ sét tốt, có hóa trị II cố định.',
    chemistryTip: 'Kẽm lưỡng tính oxi hóa, hóa trị II không bao giờ thay đổi.'
  },
  {
    id: 'be',
    name: 'Beri',
    symbol: 'Be',
    valences: [2],
    type: 'element',
    valenceText: 'II',
    category: 'Kim loại kiềm thổ',
    description: 'Kim loại nhẹ, có độc tính cao nhưng hóa trị II ổn định ở nhóm IIA.',
    chemistryTip: 'Beri hóa trị II, đứng đầu nhóm kim loại kiềm thổ.'
  },
  {
    id: 'al',
    name: 'Nhôm',
    symbol: 'Al',
    valences: [3],
    type: 'element',
    valenceText: 'III',
    category: 'Kim loại',
    description: 'Kim loại phổ biến nhất trên vỏ Trái Đất, có hóa trị III đặc trưng.',
    chemistryTip: 'Nhôm hóa trị III duy nhất: Quen thuộc trong đồ dùng học tập và lá nhôm mỏng.'
  },
  {
    id: 'b',
    name: 'Bo',
    symbol: 'B',
    valences: [3],
    type: 'element',
    valenceText: 'III',
    category: 'Á kim',
    description: 'Á kim quý hiếm, thường có hóa trị III trong các hợp chất borat.',
    chemistryTip: 'Bo hóa trị III, nằm ở ranh giới giữa kim loại và phi kim.'
  },
  {
    id: 'fe',
    name: 'Sắt',
    symbol: 'Fe',
    valences: [2, 3],
    type: 'element',
    valenceText: 'II, III',
    category: 'Kim loại chuyển tiếp',
    description: 'Trái tim của ngành luyện kim. Có hai hóa trị phổ biến là II (sắt II) và III (sắt III).',
    chemistryTip: 'Sắt đa sầu đa cảm, tác dụng HCl ra hóa trị II, tác dụng Cl khí ra hóa trị III.'
  },
  {
    id: 'cu',
    name: 'Đồng',
    symbol: 'Cu',
    valences: [1, 2],
    type: 'element',
    valenceText: 'I, II',
    category: 'Kim loại chuyển tiếp',
    description: 'Kim loại màu đỏ cam rực rỡ, thường có hóa trị II (màu xanh lam) và đôi khi hóa trị I.',
    chemistryTip: 'Đồng thường hóa trị II lôi cuốn với dung dịch màu xanh lam dịu mát.'
  },
  {
    id: 'c',
    name: 'Cacbon',
    symbol: 'C',
    valences: [2, 4],
    type: 'element',
    valenceText: 'II, IV',
    category: 'Phi kim',
    description: 'Cốt lõi của sự sống và hóa học hữu cơ. Có hóa trị II (khí độc CO) và IV (CO₂ lý tưởng).',
    chemistryTip: 'Cacbon có hóa trị II và IV, tạo nên kim cương lấp lánh.'
  },
  {
    id: 'si',
    name: 'Silic',
    symbol: 'Si',
    valences: [4],
    type: 'element',
    valenceText: 'IV',
    category: 'Á kim',
    description: 'Thành phần chính của cát và thạch anh, có hóa trị IV bền vững.',
    chemistryTip: 'Silic hóa trị IV, nền tảng của các chip bán dẫn thông minh.'
  },
  {
    id: 'n',
    name: 'Nitơ',
    symbol: 'N',
    valences: [2, 3, 4, 5],
    type: 'element',
    valenceText: 'II, III, IV, V',
    category: 'Phi kim',
    description: 'Khí chiếm 78% khí quyển, có hóa trị biến đổi phức tạp từ I đến V (trong muối amoni hay HNO₃ thường tính hóa trị III, IV).',
    chemistryTip: 'Nitơ có nhiều hóa trị biến đổi, hãy lưu ý hóa trị III và IV trong học tập nhé.'
  },
  {
    id: 'p',
    name: 'Photpho',
    symbol: 'P',
    valences: [3, 5],
    type: 'element',
    valenceText: 'III, V',
    category: 'Phi kim',
    description: 'Nguyên tố có dạng thù hình đỏ và trắng, có hóa trị III và V (trong P₂O₅).',
    chemistryTip: 'Photpho hóa trị III và V - Diêm quẹt lấp lánh trong đêm.'
  },
  {
    id: 's',
    name: 'Lưu huỳnh',
    symbol: 'S',
    valences: [2, 4, 6],
    type: 'element',
    valenceText: 'II, IV, VI',
    category: 'Phi kim',
    description: 'Màu vàng tươi sáng rực rỡ, hóa trị II (H₂S mùi trứng thối), IV (SO₂), VI (H₂SO₄).',
    chemistryTip: 'Lưu huỳnh chẵn chục hai bốn sáu, hóa trị biến đổi nhịp nhàng siêu hoa lệ.'
  }
];

export const RADICALS_DATA: ChemicalItem[] = [
  {
    id: 'oh',
    name: 'Hiđrôxit',
    symbol: 'OH',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc hóa trị I',
    description: 'Nhóm bazơ đặc trưng, kết hợp với các ion kim loại tạo thành bazơ.',
    chemistryTip: 'Hiđrôxit (OH) hiền dịu mang hóa trị I.'
  },
  {
    id: 'no3',
    name: 'Nitrat',
    symbol: 'NO₃',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc axit hóa trị I',
    description: 'Tất cả các muối nitrat đều tan rất tốt trong nước, là gốc của axit nitric HNO₃.',
    chemistryTip: 'Nitrat (NO₃) đỏng đảnh, hóa trị I luôn luôn tan rất nhanh.'
  },
  {
    id: 'hco3',
    name: 'Hiđrocacbonat',
    symbol: 'HCO₃',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc axit hóa trị I',
    description: 'Axit yếu, lưỡng tính, quen thuộc trong bột nở làm bánh muffin dễ thương.',
    chemistryTip: 'Có chữ "Hiđrô" đi kèm làm giảm hóa trị của Cacbonat từ II xuống hóa trị I!'
  },
  {
    id: 'hso4',
    name: 'Hiđrosunfat',
    symbol: 'HSO₄',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc axit hóa trị I',
    description: 'Gốc axit trung gian của axit sunfuric, mang hóa trị I.',
    chemistryTip: 'Gốc Sunfat hóa trị II, ghép thêm 1 H hóa trị I thì hóa trị gốc giảm còn I.'
  },
  {
    id: 'ch3coo',
    name: 'Axetat',
    symbol: 'CH₃COO',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc axit hữu cơ',
    description: 'Gốc axit từ giấm ăn hằng ngày, siêu nữ tính và dịu nhẹ, mang hóa trị I.',
    chemistryTip: 'Đuôi chua ngọt ngào của giấm ăn hữu cơ mang hóa trị I tinh nghịch.'
  },
  {
    id: 'so4',
    name: 'Sunfat',
    symbol: 'SO₄',
    valences: [2],
    type: 'radical',
    valenceText: 'II',
    category: 'Gốc axit hóa trị II',
    description: 'Gốc của axit vua H₂SO₄, tạo kết tủa bền vững màu trắng mộng mơ với Bari (Ba).',
    chemistryTip: 'Sunfat (SO₄) mạnh mẽ kiên cường với hóa trị II.'
  },
  {
    id: 'co3',
    name: 'Cacbonat',
    symbol: 'CO₃',
    valences: [2],
    type: 'radical',
    valenceText: 'II',
    category: 'Gốc axit hóa trị II',
    description: 'Gốc cấu thành đá vôi và phấn viết bảng dễ thương, tạo bọt sủi lấp lánh khi gặp axit.',
    chemistryTip: 'Cacbonat (CO₃) sủi bọt lãng mạn mang hóa trị II.'
  },
  {
    id: 'so3',
    name: 'Sunfit',
    symbol: 'SO₃',
    valences: [2],
    type: 'radical',
    valenceText: 'II',
    category: 'Gốc axit hóa trị II',
    description: 'Gốc của axit yếu H₂SO₃, dễ giải phóng khí SO₂ có mùi hắc đặc trưng.',
    chemistryTip: 'Tương tự Sunfat nhưng ít oxi hơn, vẫn giữ tròn hóa trị II.'
  },
  {
    id: 's_radical',
    name: 'Sunfua',
    symbol: 'S (gốc)',
    valences: [2],
    type: 'radical',
    valenceText: 'II',
    category: 'Gốc axit hóa trị II',
    description: 'Gốc muối không chứa oxi của lưu huỳnh (như muối sulfide).',
    chemistryTip: 'Lưu huỳnh trực tiếp liên kết kim loại mang hóa trị II.'
  },
  {
    id: 'po4',
    name: 'Photphat',
    symbol: 'PO₄',
    valences: [3],
    type: 'radical',
    valenceText: 'III',
    category: 'Gốc axit hóa trị III',
    description: 'Gốc axit của H₃PO₄, tạo kết tủa vàng ngọc ngà Ag₃PO₄ lấp lánh.',
    chemistryTip: 'Photphat (PO₄) hoàng gia quyền lực mang hóa trị III độc bản!'
  },
  {
    id: 'h2po4',
    name: 'Đihiđrophotphat',
    symbol: 'H₂PO₄',
    valences: [1],
    type: 'radical',
    valenceText: 'I',
    category: 'Gốc axit hóa trị I',
    description: 'Gốc axit mang hai hiđrô của axit photphoric, làm giảm hóa trị xuống I.',
    chemistryTip: 'Có hai hiđrô đính kèm nên hóa trị hạ hẳn từ III xuống còn hóa trị I.'
  },
  {
    id: 'hpo4',
    name: 'Hiđrophotphat',
    symbol: 'HPO₄',
    valences: [2],
    type: 'radical',
    valenceText: 'II',
    category: 'Gốc axit hóa trị II',
    description: 'Gốc axit mang một hiđrô của axit photphoric, giữ hóa trị II.',
    chemistryTip: 'Một hiđrô giúp hạ bớt một hóa trị so với PO₄ (III), còn lại hóa trị II.'
  }
];

export const ALL_CHEMICALS_DATA: ChemicalItem[] = [...ELEMENTS_DATA, ...RADICALS_DATA];

export const MNEMONIC_PEOM = [
  { line: "Kali, Iốt, Natri", comment: "Cùng Bạc, Clo một loài hóa trị I" },
  { line: "Là hóa trị một em ơi", comment: "Nhớ ghi cho rõ kẻo rồi phân vân" },
  { line: "Magiê, Kẽm với Bari", comment: "Canxi, Chì, Đồng đều hóa trị II" },
  { line: "Oxi, Thủy ngân cũng thế thôi", comment: "Nhôm đây hóa trị III lăng nhăng chút gì" },
  { line: "Cacbon, Silic này đây", comment: "Có thêm hóa trị IV thực là chẳng sai" },
  { line: "Sắt kia kể cũng đa tài", comment: "Hóa trị II, III dễ dượt hoài không ngơi" },
  { line: "Nitơ rắc rối nhất đời", comment: "I, II, III, IV, V thời mệt thay" },
  { line: "Lưu huỳnh lúc chẵn thế này", comment: "II, IV và VI tăng đều lên mau" },
  { line: "Photpho năm ấy có sau", comment: "Hóa trị III và V ghi sâu vào lòng" }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quiz_win',
    title: 'Hoa Đầu Mùa',
    description: 'Hoàn thành lượt đố vui đầu tiên xuất sắc.',
    icon: '🌱',
    isUnlocked: false,
    requirementText: 'Trả lời đúng ít nhất 1 câu trong Chế độ Đố Vui.'
  },
  {
    id: 'perfect_streak',
    title: 'Nữ Thần Hóa Học',
    description: 'Đạt chuỗi trả lời đúng 5 câu liên tiếp.',
    icon: '👑',
    isUnlocked: false,
    requirementText: 'Trả lời đúng liên tiếp 5 câu hỏi.'
  },
  {
    id: 'fast_matcher',
    title: 'Kỷ Lục Ma Thuật',
    description: 'Hoàn thành kết đôi ma thuật dưới 45 giây.',
    icon: '⚡',
    isUnlocked: false,
    requirementText: 'Ghép thành công mọi cặp thẻ có bóng hoa dưới 45 giây.'
  },
  {
    id: 'sorter_champion',
    title: 'Chuyên Gia Phân Loại',
    description: 'Sắp xếp chuẩn xác 10 nguyên tố/gốc muối liên tục vào lọ hóa trị.',
    icon: '✨',
    isUnlocked: false,
    requirementText: 'Sắp xếp chuẩn không sai sót 10 vật phẩm trong lọ phép.'
  },
  {
    id: 'survivor',
    title: 'Trái Tim Bền Bỉ',
    description: 'Đạt điểm số 10 trong đố vui mà không mất trái tim nào.',
    icon: '💖',
    isUnlocked: false,
    requirementText: 'Trả lời được 10 câu với 3 tim nguyên vẹn.'
  },
  {
    id: 'bookworm',
    title: 'Học Giả Vườn Hoa',
    description: 'Mở xem sổ tay hóa học và đọc ít nhất 5 mẹo ghi nhớ.',
    icon: '📖',
    isUnlocked: false,
    requirementText: 'Truy cập tab Sổ Tay để đọc kiến thức hóa học.'
  }
];

export const CHEMISTRY_PUNS_AND_MESSAGES = [
  "Cậu có biết? Tình yêu tớ dành cho cậu tỏa nhiệt tựa phản ứng giữa Natri và nước mát vậy đó! 💧💥",
  "Nước mắt cậu rơi làm lòng tớ kết tủa tựa BaSO₄ không tan trong mọi nỗi niềm... 🌧️🤍",
  "Hôm nay trông cậu rạng ngời như ánh lửa hồng khi đốt muối Canxi vậy, siêu ấm áp! 🔥✨",
  "Tình bạn chúng mình bền chặt như liên kết cộng hóa trị, đập không vỡ phân không rời! 🌸💖",
  "Hãy cùng tớ dung hòa mọi áp lực học tập bằng những nụ cười tỏa hương như este thơm ngọt nhé! 🍓🧁"
];
