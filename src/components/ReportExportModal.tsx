import React, { useState } from 'react';
import { ChannelData, AiAuditResult } from '../types/youtube';
import {
  formatCompactNumber,
  formatFullNumber,
  formatCurrencyUSD,
  formatCurrencyVND,
  isShortVideo,
} from '../utils/formulas';
import { FileText, Copy, Check, Download, X, Share2, Sparkles } from 'lucide-react';

interface ReportExportModalProps {
  channel: ChannelData;
  auditResult: AiAuditResult | null;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ channel, auditResult, onClose }) => {
  const [copied, setCopied] = useState(false);

  const longVideos = channel.recentVideos.filter((v) => !isShortVideo(v));
  const shorts = channel.recentVideos.filter((v) => isShortVideo(v));

  const generateReportText = (): string => {
    return `====================================================
BÁO CÁO PHÂN TÍCH & ĐÁNH GIÁ KÊNH YOUTUBE: ${channel.title.toUpperCase()}
Ngày lập báo cáo: ${new Date().toLocaleDateString('vi-VN')}
====================================================

1. CHỈ SỐ TỔNG QUAN KÊNH:
----------------------------------------------------
- Tên kênh: ${channel.title} (${channel.customUrl || 'Chưa đặt custom URL'})
- Số lượt đăng ký (Subscribers): ${formatFullNumber(channel.subscriberCount)}
- Tổng lượt xem (Views): ${formatFullNumber(channel.viewCount)}
- Tổng số video đã đăng: ${formatFullNumber(channel.videoCount)}
- Điểm đánh giá sức khỏe kênh: ${channel.score.overall}/100 (Xếp hạng ${channel.score.tier})
- Tần suất đăng bài: ${channel.calculatedMetrics.uploadFrequencyText}
- Tỷ lệ tương tác (Engagement Rate): ${channel.calculatedMetrics.recentEngagementRate}%

2. DỰ PHÓNG DOANH THU & HIỆU SUẤT AD SENSE (Dựa trên RPM chuẩn):
----------------------------------------------------
- Doanh thu ước tính / Ngày: ${formatCurrencyUSD(channel.calculatedMetrics.dailyRevenueEstimate.avgUSD)} (~${formatCurrencyVND(channel.calculatedMetrics.dailyRevenueEstimate.avgVND)})
- Doanh thu ước tính / Tháng: ${formatCurrencyUSD(channel.calculatedMetrics.monthlyRevenueEstimate.avgUSD)} (~${formatCurrencyVND(channel.calculatedMetrics.monthlyRevenueEstimate.avgVND)})
- Tổng doanh thu tất cả view từ khi lập kênh: ${formatCurrencyUSD(channel.calculatedMetrics.totalRevenueEstimate.avgUSD)}

3. PHÂN LOẠI ĐỊNH DẠNG CONTENT (GẦN ĐÂY):
----------------------------------------------------
- Video Dài (>60s): ${longVideos.length} video
- YouTube Shorts (<=60s): ${shorts.length} video

${
  auditResult
    ? `4. ĐÁNH GIÁ TỪ CHUYÊN GIA AI (GEMINI):
----------------------------------------------------
[ĐIỂM MẠNH]
${auditResult.strengths.map((s) => `- ${s}`).join('\n')}

[ĐIỂM CẦN CẢI THIỆN]
${auditResult.weaknesses.map((w) => `- ${w}`).join('\n')}

[KHUYÊN BẬT KIẾM TIỀN & ĐIỀU HƯỚNG]
- Tiềm năng AdSense: ${auditResult.monetizationAdvice?.adRevenuePotential || 'Khá cao'}
- Nguồn thu đề xuất khác: ${auditResult.monetizationAdvice?.otherRevenueSources?.join(', ') || 'Sponsorship, Affiliate'}

[HÀNH ĐỘNG CẦN LÀM NGAY]
${auditResult.actionableRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`
    : ''
}
====================================================
Báo cáo được xuất tự động từ hệ thống YouTube Channel Audit & Creator Analytics.
====================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateReportText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Bao_Cao_YouTube_${channel.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Xuất Báo Cáo Phân Tích Kênh</h3>
            <p className="text-xs text-slate-400">
              Tải file text hoặc sao chép báo cáo chi tiết để gửi cho khách hàng, đối tác hoặc lưu trữ.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 h-64 overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {generateReportText()}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Văn Bản'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Tải File Báo Cáo (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
