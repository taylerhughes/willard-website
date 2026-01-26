import * as PandaDoc from 'pandadoc-node-client';

// Initialize PandaDoc API client with API key
const apiKey = process.env.PANDADOC_API_KEY;

if (!apiKey) {
  throw new Error('PANDADOC_API_KEY environment variable is not set');
}

// Create configuration
const config = PandaDoc.createConfiguration({
  authMethods: {
    apiKey: apiKey,
  },
});

export const documentsApi = new PandaDoc.DocumentsApi(config);
export const templatesApi = new PandaDoc.TemplatesApi(config);

interface CreateNDADocumentParams {
  accountName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  accountWebsite?: string;
  accountIndustry?: string;
}

export interface PandaDocDocument {
  id: string;
  status: string;
  name: string;
  date_created: string;
  date_modified: string;
  expiration_date?: string;
  session_id?: string;
}

/**
 * Create a document from a PandaDoc template for an NDA
 */
export async function createNDADocument(params: CreateNDADocumentParams): Promise<PandaDocDocument> {
  const templateId = process.env.PANDADOC_TEMPLATE_ID;

  if (!templateId) {
    throw new Error('PANDADOC_TEMPLATE_ID environment variable is not set');
  }

  if (!process.env.PANDADOC_API_KEY) {
    throw new Error('PANDADOC_API_KEY environment variable is not set');
  }

  try {
    // Create document from template
    const response = await documentsApi.createDocument({
      documentCreateRequest: {
        name: `NDA - ${params.accountName}`,
        templateUuid: templateId,
        recipients: [
          {
            email: params.contactEmail,
            firstName: params.contactFirstName,
            lastName: params.contactLastName,
            role: 'Client',
          },
        ],
        tokens: [
          {
            name: 'Client.FullName',
            value: `${params.contactFirstName} ${params.contactLastName}`,
          },
          {
            name: 'Client.Email',
            value: params.contactEmail,
          },
          {
            name: 'Company.Name',
            value: params.accountName,
          },
          ...(params.accountWebsite ? [{
            name: 'Company.Website',
            value: params.accountWebsite,
          }] : []),
          ...(params.accountIndustry ? [{
            name: 'Company.Industry',
            value: params.accountIndustry,
          }] : []),
        ],
        fields: {},
        metadata: {
          accountName: params.accountName,
          source: 'willard_crm',
        },
      },
    });

    return response as PandaDocDocument;
  } catch (error: any) {
    console.error('PandaDoc API Error:', error.response?.data || error.message);
    throw new Error(`Failed to create NDA document: ${error.response?.data?.detail || error.message}`);
  }
}

/**
 * Send a document to recipients
 */
export async function sendDocument(documentId: string, subject?: string, message?: string): Promise<void> {
  try {
    await documentsApi.sendDocument({
      id: documentId,
      documentSendRequest: {
        subject: subject || 'Please review and sign the NDA',
        message: message || 'Please review and sign the attached Non-Disclosure Agreement.',
        silent: false,
      },
    });
  } catch (error: any) {
    console.error('PandaDoc API Error:', error.response?.data || error.message);
    throw new Error(`Failed to send document: ${error.response?.data?.detail || error.message}`);
  }
}

/**
 * Get document status
 */
export async function getDocumentStatus(documentId: string): Promise<PandaDocDocument> {
  try {
    const response = await documentsApi.detailsDocument({ id: documentId });
    return response as PandaDocDocument;
  } catch (error: any) {
    console.error('PandaDoc API Error:', error.response?.data || error.message);
    throw new Error(`Failed to get document status: ${error.response?.data?.detail || error.message}`);
  }
}

/**
 * Get document session URL for viewing/signing
 */
export async function getDocumentSessionUrl(documentId: string): Promise<string> {
  try {
    const response = await documentsApi.createDocumentLink({
      id: documentId,
      documentCreateLinkRequest: {
        recipient: '',
        lifetime: 3600, // 1 hour
      },
    });
    // The response contains an id which is the link ID
    // Construct the full URL to the document
    return response.id ? `https://app.pandadoc.com/s/${response.id}` : '';
  } catch (error: any) {
    console.error('PandaDoc API Error:', error.response?.data || error.message);
    throw new Error(`Failed to create document link: ${error.response?.data?.detail || error.message}`);
  }
}

/**
 * Map PandaDoc status to our NDA status
 */
export function mapPandaDocStatus(pandadocStatus: string): string {
  const statusMap: Record<string, string> = {
    'document.draft': 'sent',
    'document.sent': 'sent',
    'document.viewed': 'viewed',
    'document.completed': 'completed',
    'document.signed': 'completed',
    'document.declined': 'declined',
    'document.voided': 'declined',
  };

  return statusMap[pandadocStatus] || 'sent';
}
