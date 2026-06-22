import { Request, Response } from 'express';
import Report from '../models/Report';
import MinioStorage from '../singleton/minio';
import ResponseFactory, { ErrorEnum } from '../factory/responseFactory';

// Scarica il report PDF identificato dal proprio ID
export const downloadReport = async (req: Request, res: Response): Promise<void> => {
  const report = await Report.findOne({ where: { id: req.params.id, userId: req.user.id } });

  if (!report) {
    ResponseFactory.sendError(res, ErrorEnum.ReportNotFound);
    return;
  }

  try {
    const stream = await MinioStorage.getInstance().getObject(MinioStorage.REPORTS_BUCKET, report.filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${report.id}.pdf"`);
    stream.pipe(res);
  } catch {
    ResponseFactory.sendError(res, ErrorEnum.StorageError);
  }
};