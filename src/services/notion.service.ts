import { FetchBuilder } from "../utils/fetch.builder";

type NotionConfig = {
    version: string,
    apiKey: string
}

type NotionDatabaseSimpleRecord = { [key: string]: string }

export class NotionService {

    private readonly config: NotionConfig;

    private endpoints = {
        GET_DATABASE: 'https://api.notion.com/v1/databases/{0}/query'
    }

    constructor(config?: NotionConfig) {
        this.config = config ?? {
            version: process.env.NOTION_VERSION!,
            apiKey: process.env.NOTION_APIKEY!
        };
    }

    async getDatabasePage<TRecord>(databaseId: string, pageSize: number = 100, cursor?: string): Promise<TRecord[]> {
        const endpoint = this.endpoints.GET_DATABASE.replace('{0}', databaseId);

        const databaseRecords = await FetchBuilder
            .post<any>(endpoint)
            .setHeaders({
                'Authorization': 'Bearer ' + this.config.apiKey,
                'Notion-Version': this.config.version
            })
            .setBody({
                filter: {},
                pageSize: pageSize
            })
            .execute();

        const records: any[] = this.mapDatabaseRecords(databaseRecords.body);

        return records;
    }

    private mapDatabaseRecords(databaseRecords: any): NotionDatabaseSimpleRecord[] {
        const records: NotionDatabaseSimpleRecord[] = databaseRecords.results.map((r: { properties: { [x: string]: any; }; }) => {
            const record: NotionDatabaseSimpleRecord = {};
            let propertyNames = Object.keys(r.properties);

            for (const propertyKey in propertyNames) {
                const propertyName = propertyNames[propertyKey];
                const propertyValue = r.properties[propertyName];

                if (propertyValue[propertyValue.type] && propertyValue[propertyValue.type][0])
                    record[propertyName] = propertyValue[propertyValue.type][0]?.plain_text;
            }
            
            return record;
        });

        return records;
    }
}