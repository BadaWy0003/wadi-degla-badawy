const IndexRouter = require('../routes/index.route');
const AuthRouter = require('../routes/auth.route');
const CustomerRouter = require('../routes/customer.route');
const AdminRouter = require('../routes/admin.route');
const PdfExportRouter = require('../routes/pdfExport.route');
const StorageRouter = require('../routes/storage.route');
const NewsRouter = require('../routes/news.route');
const ProjectsRouter = require('../routes/projects.route');
const PublishRouter = require('../routes/publish.route');
const SiteContentRouter = require('../routes/site-content.route');
const EnquiriesRouter = require('../routes/enquiries.route');
const OverviewRouter = require('../routes/overview.route');

module.exports = (app) => {
  // email the tech team when the API keeps answering with errors (alerts.service.js)
  app.use(require('../services/alerts.service').serverErrors);
  app.use('/api/index', IndexRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/customer', CustomerRouter);
  app.use('/api/admin', AdminRouter);
  app.use('/api/export-pdf', PdfExportRouter);
  app.use('/api/storage', StorageRouter);
  app.use('/api/news', NewsRouter);
  app.use('/api/projects', ProjectsRouter);
  app.use('/api/publish', PublishRouter);
  app.use('/api/content', SiteContentRouter);
  app.use('/api/enquiries', EnquiriesRouter);
  app.use('/api/overview', OverviewRouter);
  app.use('/api/send-email', require('../routes/sendEmail'));
  app.use('/api/chat', require('../routes/chat.route'));
};
