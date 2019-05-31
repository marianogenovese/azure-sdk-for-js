/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

export {
  discriminators,
  Activity,
  ActivityDependency,
  ActivityPolicy,
  AmazonMWSLinkedService,
  AmazonMWSObjectDataset,
  AmazonMWSSource,
  AmazonRedshiftLinkedService,
  AmazonRedshiftSource,
  AmazonS3Dataset,
  AmazonS3LinkedService,
  AmazonS3Location,
  AmazonS3ReadSetting,
  AppendVariableActivity,
  AvroFormat,
  AzureBatchLinkedService,
  AzureBlobDataset,
  AzureBlobFSDataset,
  AzureBlobFSLinkedService,
  AzureBlobFSLocation,
  AzureBlobFSReadSetting,
  AzureBlobFSSink,
  AzureBlobFSSource,
  AzureBlobFSWriteSetting,
  AzureBlobStorageLinkedService,
  AzureBlobStorageLocation,
  AzureBlobStorageReadSetting,
  AzureBlobStorageWriteSetting,
  AzureDatabricksLinkedService,
  AzureDataExplorerLinkedService,
  AzureDataExplorerSink,
  AzureDataExplorerSource,
  AzureDataExplorerTableDataset,
  AzureDataLakeAnalyticsLinkedService,
  AzureDataLakeStoreDataset,
  AzureDataLakeStoreLinkedService,
  AzureDataLakeStoreLocation,
  AzureDataLakeStoreReadSetting,
  AzureDataLakeStoreSink,
  AzureDataLakeStoreSource,
  AzureDataLakeStoreWriteSetting,
  AzureFunctionActivity,
  AzureFunctionLinkedService,
  AzureKeyVaultLinkedService,
  AzureKeyVaultSecretReference,
  AzureMLBatchExecutionActivity,
  AzureMLLinkedService,
  AzureMLUpdateResourceActivity,
  AzureMLWebServiceFile,
  AzureMySqlLinkedService,
  AzureMySqlSource,
  AzureMySqlTableDataset,
  AzurePostgreSqlLinkedService,
  AzurePostgreSqlSource,
  AzurePostgreSqlTableDataset,
  AzureQueueSink,
  AzureSearchIndexDataset,
  AzureSearchIndexSink,
  AzureSearchLinkedService,
  AzureSqlDatabaseLinkedService,
  AzureSqlDWLinkedService,
  AzureSqlDWTableDataset,
  AzureSqlSink,
  AzureSqlSource,
  AzureSqlTableDataset,
  AzureStorageLinkedService,
  AzureTableDataset,
  AzureTableSink,
  AzureTableSource,
  AzureTableStorageLinkedService,
  BaseResource,
  BlobEventsTrigger,
  BlobSink,
  BlobSource,
  BlobTrigger,
  CassandraLinkedService,
  CassandraSource,
  CassandraTableDataset,
  CloudError,
  ConcurLinkedService,
  ConcurObjectDataset,
  ConcurSource,
  ConnectorReadSetting,
  ConnectorWriteSetting,
  ControlActivity,
  CopyActivity,
  CopySink,
  CopySource,
  CosmosDbLinkedService,
  CosmosDbMongoDbApiCollectionDataset,
  CosmosDbMongoDbApiLinkedService,
  CosmosDbMongoDbApiSink,
  CosmosDbMongoDbApiSource,
  CouchbaseLinkedService,
  CouchbaseSource,
  CouchbaseTableDataset,
  CustomActivity,
  CustomActivityReferenceObject,
  CustomDataset,
  CustomDataSourceLinkedService,
  DatabricksNotebookActivity,
  DatabricksSparkJarActivity,
  DatabricksSparkPythonActivity,
  DataLakeAnalyticsUSQLActivity,
  Dataset,
  DatasetBZip2Compression,
  DatasetCompression,
  DatasetDeflateCompression,
  DatasetFolder,
  DatasetGZipCompression,
  DatasetListResponse,
  DatasetLocation,
  DatasetReference,
  DatasetResource,
  DatasetStorageFormat,
  DatasetZipDeflateCompression,
  Db2LinkedService,
  DeleteActivity,
  DelimitedTextDataset,
  DelimitedTextReadSetting,
  DelimitedTextSink,
  DelimitedTextSource,
  DelimitedTextWriteSetting,
  DependencyReference,
  DistcpSettings,
  DocumentDbCollectionDataset,
  DocumentDbCollectionSink,
  DocumentDbCollectionSource,
  DrillLinkedService,
  DrillSource,
  DrillTableDataset,
  DynamicsAXLinkedService,
  DynamicsAXResourceDataset,
  DynamicsAXSource,
  DynamicsEntityDataset,
  DynamicsLinkedService,
  DynamicsSink,
  DynamicsSource,
  EloquaLinkedService,
  EloquaObjectDataset,
  EloquaSource,
  EntityReference,
  ExecutePipelineActivity,
  ExecuteSSISPackageActivity,
  ExecutionActivity,
  Expression,
  Factory,
  FactoryGitHubConfiguration,
  FactoryIdentity,
  FactoryRepoConfiguration,
  FactoryVSTSConfiguration,
  FileServerLinkedService,
  FileServerLocation,
  FileServerReadSetting,
  FileServerWriteSetting,
  FileShareDataset,
  FileSystemSink,
  FileSystemSource,
  FilterActivity,
  ForEachActivity,
  FormatReadSetting,
  FormatWriteSetting,
  FtpReadSetting,
  FtpServerLinkedService,
  FtpServerLocation,
  GetMetadataActivity,
  GoogleAdWordsLinkedService,
  GoogleAdWordsObjectDataset,
  GoogleAdWordsSource,
  GoogleBigQueryLinkedService,
  GoogleBigQueryObjectDataset,
  GoogleBigQuerySource,
  GreenplumLinkedService,
  GreenplumSource,
  GreenplumTableDataset,
  HBaseLinkedService,
  HBaseObjectDataset,
  HBaseSource,
  HdfsLinkedService,
  HdfsLocation,
  HdfsReadSetting,
  HdfsSource,
  HDInsightHiveActivity,
  HDInsightLinkedService,
  HDInsightMapReduceActivity,
  HDInsightOnDemandLinkedService,
  HDInsightPigActivity,
  HDInsightSparkActivity,
  HDInsightStreamingActivity,
  HiveLinkedService,
  HiveObjectDataset,
  HiveSource,
  HttpDataset,
  HttpLinkedService,
  HttpReadSetting,
  HttpServerLocation,
  HttpSource,
  HubspotLinkedService,
  HubspotObjectDataset,
  HubspotSource,
  IfConditionActivity,
  ImpalaLinkedService,
  ImpalaObjectDataset,
  ImpalaSource,
  IntegrationRuntime,
  IntegrationRuntimeComputeProperties,
  IntegrationRuntimeCustomSetupScriptProperties,
  IntegrationRuntimeDataProxyProperties,
  IntegrationRuntimeReference,
  IntegrationRuntimeResource,
  IntegrationRuntimeSsisCatalogInfo,
  IntegrationRuntimeSsisProperties,
  IntegrationRuntimeVNetProperties,
  JiraLinkedService,
  JiraObjectDataset,
  JiraSource,
  JsonFormat,
  LinkedIntegrationRuntimeKeyAuthorization,
  LinkedIntegrationRuntimeRbacAuthorization,
  LinkedIntegrationRuntimeType,
  LinkedService,
  LinkedServiceReference,
  LinkedServiceResource,
  LogStorageSettings,
  LookupActivity,
  MagentoLinkedService,
  MagentoObjectDataset,
  MagentoSource,
  ManagedIntegrationRuntime,
  MariaDBLinkedService,
  MariaDBSource,
  MariaDBTableDataset,
  MarketoLinkedService,
  MarketoObjectDataset,
  MarketoSource,
  MongoDbCollectionDataset,
  MongoDbCursorMethodsProperties,
  MongoDbLinkedService,
  MongoDbSource,
  MongoDbV2CollectionDataset,
  MongoDbV2LinkedService,
  MongoDbV2Source,
  MultiplePipelineTrigger,
  MySqlLinkedService,
  NetezzaLinkedService,
  NetezzaSource,
  NetezzaTableDataset,
  ODataLinkedService,
  ODataResourceDataset,
  OdbcLinkedService,
  OdbcSink,
  Office365Dataset,
  Office365LinkedService,
  Office365Source,
  OracleLinkedService,
  OraclePartitionSettings,
  OracleServiceCloudLinkedService,
  OracleServiceCloudObjectDataset,
  OracleServiceCloudSource,
  OracleSink,
  OracleSource,
  OracleTableDataset,
  OrcFormat,
  ParameterSpecification,
  ParquetDataset,
  ParquetFormat,
  ParquetSink,
  ParquetSource,
  PaypalLinkedService,
  PaypalObjectDataset,
  PaypalSource,
  PhoenixLinkedService,
  PhoenixObjectDataset,
  PhoenixSource,
  PipelineFolder,
  PipelineReference,
  PipelineResource,
  PolybaseSettings,
  PostgreSqlLinkedService,
  PrestoLinkedService,
  PrestoObjectDataset,
  PrestoSource,
  QuickBooksLinkedService,
  QuickBooksObjectDataset,
  QuickBooksSource,
  RecurrenceSchedule,
  RecurrenceScheduleOccurrence,
  RedirectIncompatibleRowSettings,
  RedshiftUnloadSettings,
  RelationalSource,
  RelationalTableDataset,
  RerunTriggerResource,
  RerunTumblingWindowTrigger,
  Resource,
  ResponsysLinkedService,
  ResponsysObjectDataset,
  ResponsysSource,
  RestResourceDataset,
  RestServiceLinkedService,
  RestSource,
  RetryPolicy,
  SalesforceLinkedService,
  SalesforceMarketingCloudLinkedService,
  SalesforceMarketingCloudObjectDataset,
  SalesforceMarketingCloudSource,
  SalesforceObjectDataset,
  SalesforceSink,
  SalesforceSource,
  SapBWLinkedService,
  SapCloudForCustomerLinkedService,
  SapCloudForCustomerResourceDataset,
  SapCloudForCustomerSink,
  SapCloudForCustomerSource,
  SapEccLinkedService,
  SapEccResourceDataset,
  SapEccSource,
  SapHanaLinkedService,
  SapOpenHubLinkedService,
  SapOpenHubSource,
  SapOpenHubTableDataset,
  SapTableLinkedService,
  SapTablePartitionSettings,
  SapTableSource,
  ScheduleTrigger,
  ScheduleTriggerRecurrence,
  ScriptAction,
  SecretBase,
  SecureString,
  SelfDependencyTumblingWindowTriggerReference,
  SelfHostedIntegrationRuntime,
  ServiceNowLinkedService,
  ServiceNowObjectDataset,
  ServiceNowSource,
  SetVariableActivity,
  SftpLocation,
  SftpReadSetting,
  SftpServerLinkedService,
  ShopifyLinkedService,
  ShopifyObjectDataset,
  ShopifySource,
  SparkLinkedService,
  SparkObjectDataset,
  SparkSource,
  SqlDWSink,
  SqlDWSource,
  SqlServerLinkedService,
  SqlServerSink,
  SqlServerSource,
  SqlServerStoredProcedureActivity,
  SqlServerTableDataset,
  SqlSink,
  SqlSource,
  SquareLinkedService,
  SquareObjectDataset,
  SquareSource,
  SSISExecutionCredential,
  SSISExecutionParameter,
  SSISPackageLocation,
  SSISPropertyOverride,
  StagingSettings,
  StoredProcedureParameter,
  SubResource,
  SybaseLinkedService,
  TeradataLinkedService,
  TextFormat,
  Trigger,
  TriggerDependencyReference,
  TriggerPipelineReference,
  TriggerReference,
  TriggerResource,
  TumblingWindowTrigger,
  TumblingWindowTriggerDependencyReference,
  UntilActivity,
  UserProperty,
  ValidationActivity,
  VariableSpecification,
  VerticaLinkedService,
  VerticaSource,
  VerticaTableDataset,
  WaitActivity,
  WebActivity,
  WebActivityAuthentication,
  WebAnonymousAuthentication,
  WebBasicAuthentication,
  WebClientCertificateAuthentication,
  WebHookActivity,
  WebLinkedService,
  WebLinkedServiceTypeProperties,
  WebSource,
  WebTableDataset,
  XeroLinkedService,
  XeroObjectDataset,
  XeroSource,
  ZohoLinkedService,
  ZohoObjectDataset,
  ZohoSource
} from "../models/mappers";
