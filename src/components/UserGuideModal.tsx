import React from 'react';
import {
  BookOpen,
  Printer,
  Download,
  X,
  Sparkles,
  Search,
  BarChart2,
  Wand2,
  DollarSign,
  Split,
  Clock,
  ShieldCheck,
  Layers,
  Briefcase,
  Key,
  Users,
  CheckCircle2,
  Lightbulb,
  FileText,
  TrendingUp,
  HelpCircle,
  Video,
  Award,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Cẩm Nang Hướng Dẫn Sử Dụng Ứng Dụng</h2>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  PDF Guide v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">Tài liệu hướng dẫn phân tích kênh YouTube & Bộ công cụ AI Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all"
              title="Xuất file PDF hoặc in trực tiếp"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In / Tải File PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scroll Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-200 text-sm leading-relaxed" id="user-guide-print-area">
          {/* Cover & Title Section */}
          <div className="border-b border-slate-800 pb-8 space-y-4 text-center sm:text-left bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border print:border-black print:bg-white print:text-black">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold print:border-black print:text-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUTUBE PRO ANALYTICS & CREATOR STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight print:text-black">
              HƯỚNG DẪN SỬ DỤNG TOÀN DIỆN HỆ THỐNG
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl print:text-gray-700">
              Tài liệu hướng dẫn chi tiết cách khai thác 100% sức mạnh của hệ thống phân tích kênh YouTube chuẩn xác (Precision Engine), kết hợp cùng công nghệ kiểm duyệt trí tuệ nhân tạo Gemini AI và bộ công cụ Creator Studio Master Suite (7-in-1).
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80 print:border-gray-300 print:text-black">
              <div><strong>Ngày cập nhật:</strong> 2026</div>
              <div><strong>Phiên bản:</strong> v2.5 Studio Suite</div>
              <div><strong>Định dạng:</strong> PDF User Manual</div>
            </div>
          </div>

          {/* Quick Table of Contents */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 no-print">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>Mục Lục Hướng Dẫn</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-semibold text-slate-300">
              <a href="#section-1" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                1. Giới Thiệu & API Key
              </a>
              <a href="#section-2" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                2. Tra Cứu Kênh Chuẩn Xác
              </a>
              <a href="#section-3" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                3. Các Chỉ Số Phân Tích
              </a>
              <a href="#section-4" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                4. Gemini AI Audit Kênh
              </a>
              <a href="#section-5" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                5. Bộ Công Cụ Studio (7-in-1)
              </a>
              <a href="#section-6" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                6. So Sánh & Yêu Thích
              </a>
              <a href="#section-7" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                7. Xuất Báo Cáo PDF
              </a>
              <a href="#section-8" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                8. Mẹo & Troubleshooting
              </a>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>CHƯƠNG 1: TỔNG QUAN & CẤU HÌNH API KEY</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>
                Ứng dụng <strong>YouTube Pro Analytics</strong> được thiết kế dựa trên nguyên tắc <strong>Zero Fake Data</strong> (Tuyệt đối không sử dụng dữ liệu giả lập hay ngẫu nhiên). Tất cả số liệu lượt xem, lượt đăng ký, danh sách video và chỉ số tương tác đều được truy vấn trực tiếp từ cơ sở dữ liệu chính thức của <strong>YouTube Data API v3</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 print:border-gray-300 print:bg-gray-100">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs print:text-black">
                  <Key className="w-4 h-4" />
                  Cách Cấu Hình YouTube API Key Cá Nhân:
                </span>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Nhấn vào nút <strong>"YouTube API Key"</strong> ở góc trên bên phải màn hình.</li>
                  <li>Truy cập <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Google Cloud Console</a> và bật dịch vụ <em>YouTube Data API v3</em>.</li>
                  <li>Tạo một API Key mới, dán vào ô nhập liệu và nhấn <strong>Lưu Key</strong>.</li>
                  <li>Hệ thống sẽ ghi nhớ key trên trình duyệt của bạn một cách bảo mật.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <Search className="w-5 h-5 text-blue-400" />
              <span>CHƯƠNG 2: HƯỚNG DẪN TRA CỨU KÊNH YOUTUBE</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>Thanh tìm kiếm thông minh hỗ trợ 3 định dạng đầu vào linh hoạt:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-red-400 block">1. Nhập @handle:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">Ví dụ: <code>@MrBeast</code>, <code>@F8VNOfficial</code></p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-blue-400 block">2. Nhập URL Kênh:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">Đường dẫn đầy đủ từ thanh địa chỉ trình duyệt.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-purple-400 block">3. Nhập Channel ID:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">Ví dụ: <code>UCX6OQ3DkcsbYNE6H8uQQuVA</code></p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <span>CHƯƠNG 3: GIẢI MÃ CÁC CHỈ SỐ METRICS NÂNG CAO</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>Dưới đây là các công thức toán học và tiêu chuẩn đánh giá chỉ số được áp dụng trong ứng dụng:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-emerald-400">1. Tỷ Lệ Tương Tác (Engagement Rate)</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed print:text-gray-700">
                    Tính bằng tổng <code>(Lượt Thích + Bình Luận) / Lượt Xem</code>.
                    <br />
                    • &gt; 5%: Kênh có cộng đồng cực kỳ trung thành.
                    <br />
                    • 2% - 5%: Mức trung bình khỏe mạnh.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-amber-400">2. Dự Đoán RPM / CPM AdSense</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed print:text-gray-700">
                    Dựa trên độ dài trung bình video & thị trường ngôn ngữ chính.
                    <br />
                    • Kênh Tiếng Việt: RPM từ 0.3 USD - 1.5 USD / 1.000 views.
                    <br />
                    • Kênh Tiếng Anh/US: RPM từ 2.0 USD - 8.0 USD / 1.000 views.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-purple-400">3. Điểm Sức Khỏe Kênh (Channel Health Score)</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed print:text-gray-700">
                    Điểm số tổng hợp từ 0-100% dựa trên 4 trụ cột: Tần suất đăng bài, Tỷ lệ xem/sub, Tương tác khán giả & Tốc độ tăng trưởng.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-blue-400">4. Tần Suất Đăng Bài (Upload Velocity)</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed print:text-gray-700">
                    Tính trung bình số lượng video công khai được xuất bản theo chu kỳ tuần và tháng.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>CHƯƠNG 4: BÁO CÁO PHÂN TÍCH CHUYÊN SÂU AI GEMINI</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>
                Báo cáo <strong>AI Audit</strong> sử dụng mô hình ngôn ngữ thế hệ mới <strong>Gemini 3.6 Flash</strong> để đóng vai một chuyên gia chiến lược YouTube cao cấp. Báo cáo tự động chỉ ra:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong>Điểm Mạnh Độc Quyền (Strengths):</strong> Những yếu tố giúp kênh nổi bật so với đối thủ cùng ngách.</li>
                <li><strong>Điểm Cần Cải Thiện (Weaknesses):</strong> Các lỗ hổng về thiết kế thumbnail, tiêu đề hoặc thời lượng video gây sụt giảm tỷ lệ giữ chân.</li>
                <li><strong>Chiến Lược Hành Động (Actionable Strategies):</strong> Lộ trình 3-5 bước thực tiễn có thể áp dụng ngay cho video kế tiếp.</li>
                <li><strong>Đề Xuất Chủ Đề Video Tiếp Theo:</strong> Ý tưởng tiêu đề & cấu trúc nội dung đón đầu xu hướng.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <Wand2 className="w-5 h-5 text-red-500" />
              <span>CHƯƠNG 5: LÀM CHỦ BỘ CÔNG CỤ STUDIO MASTER SUITE (7-IN-1)</span>
            </h2>
            <div className="space-y-3 text-xs text-slate-300 print:text-gray-800">
              <p>Chuyển sang tab <strong>"Công Cụ Studio"</strong> để sử dụng trọn bộ 7 công cụ độc quyền dành cho Creator:</p>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-amber-400">1. Ý Tưởng Viral, Hook 3s & Thumbnail Idea:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Nhập từ khóa chủ đề, AI sẽ sinh ra 5 tiêu đề tối ưu CTR, 3 câu Hook mở đầu kích thích tò mò và ý tưởng thiết kế ảnh bìa Thumbnail tương phản cao.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-red-400">2. Trình Lập Kịch Bản Video 5 Bước (Script Generator):</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Tự động tạo kịch bản chi tiết theo mốc thời gian (Timeline), kèm chỉ dẫn góc quay (Visual Cues), âm thanh (Audio Cues) và điểm ngắt nhịp (Pattern Interrupt) để chống người xem thoát trang.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-blue-400">3. Nghiên Cứu Từ Khóa SEO & Phân Tích Độ Cạnh Tranh:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Tra cứu lượng tìm kiếm, danh sách từ khóa đuôi dài (Long-tail keywords) và thẻ hashtag đề xuất dán trực tiếp vào mô tả video.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-emerald-400">4. Báo Giá Sponsorship & Media Kit Cho Nhãn Hàng:</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Tự động tính khung giá tài trợ chuẩn (Dedicated, Integrated, Shorts) và định dạng mẫu Media Kit chuyên nghiệp để gửi trực tiếp cho Brand/Agency.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-purple-400">5. A/B Test Simulator (So Sánh Thumbnail Real-time):</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Trực quan hóa thiết kế Thumbnail A vs B ngay trên giao diện YouTube Feed thực tế để kiểm tra tính thu hút trước khi xuất bản.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-amber-300">6. Mô Phỏng Thu Nhập Kênh (Revenue Simulator):</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Kéo thanh trượt điều chỉnh chỉ số Lượt xem hàng tháng, chỉ số RPM và hợp đồng tài trợ để ước tính doanh thu tháng & năm.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 print:border-gray-300 print:bg-gray-100">
                  <span className="font-bold text-blue-300">7. Lịch Đăng Bài Giờ Vàng (Schedule Planner):</span>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Phân tích thói quen xem video của người dùng Việt Nam theo từng ngày trong tuần để đề xuất khung giờ phát sóng có tỷ lệ lên đề xuất cao nhất.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <Users className="w-5 h-5 text-blue-400" />
              <span>CHƯƠNG 6: SO SÁNH KÊNH, YÊU THÍCH & LỊCH SỬ</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>
                • <strong>So Sánh Kênh:</strong> Cho phép thêm 2 hoặc nhiều kênh vào danh sách so sánh song song để đánh giá khoảng cách về Lượt đăng ký, Lượt xem trung bình và Tỷ lệ tương tác.
                <br />
                • <strong>Lưu Yêu Thích & Lịch Sử:</strong> Dễ dàng quay lại các kênh đã phân tích trước đó chỉ với 1 cú nhấp chuột.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="space-y-3 pt-4 border-t border-slate-800/80 print:border-gray-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-black">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>CHƯƠNG 7: XUẤT BÁO CÁO FILE PDF ĐỊNH DẠNG CHUYÊN NGHIỆP</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <p>
                Tại trang Dashboard phân tích kênh, nhấn vào nút <strong>"Xuất Báo Cáo PDF"</strong> để tạo file báo cáo kiểm duyệt thương hiệu đẹp mắt, bao gồm ảnh đại diện kênh, thông số tổng quan, biểu đồ tương tác, danh sách video top đầu và đánh giá từ AI.
              </p>
            </div>
          </section>

          {/* Sign off Footer */}
          <div className="pt-8 border-t border-slate-800 text-center space-y-2 print:border-gray-400 print:text-black">
            <div className="text-xs font-bold text-white print:text-black">YouTube Pro Analytics - Precision Engine v2.5</div>
            <p className="text-[11px] text-slate-500 print:text-gray-600">
              Tài liệu hướng dẫn phát hành chính thức năm 2026. Mọi thắc mắc xin liên hệ bộ phận hỗ trợ kỹ thuật qua giao diện ứng dụng.
            </p>
          </div>
        </div>

        {/* Footer actions no-print */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print shrink-0">
          <span className="text-xs text-slate-500">Mẹo: Bạn có thể lưu thành file .pdf bằng cách chọn "Save as PDF" khi in.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
