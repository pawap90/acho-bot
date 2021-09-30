import fetch, { Response as FetchResponse } from 'node-fetch';

type FetchBuilderResult<T> = {
    ok: boolean,
    status: number,
    body: T,
    rawResponse: FetchResponse
}

export class FetchBuilderError extends Error {
    status: number;
    body: string;
    response: FetchResponse;

    constructor(message: string, response: FetchResponse, body: string) {
        super(message);
        
        this.status = response.status;
        this.body = body;
        this.response = response;
        Object.setPrototypeOf(this, FetchBuilderError.prototype);
    }
}

export class FetchBuilder<TExpectedResult> {

    private method: string;
    private endpoint!: string;
    private headers?: { [key: string]: string };
    private body?: any;
    private result?: FetchBuilderResult<TExpectedResult>;

    private constructor(endpoint: string, method: string) {
        this.method = method;
        this.endpoint = endpoint;
    }

    static get<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'GET');
        return fetchBuilder;
    }

    static post<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'POST');
        return fetchBuilder;
    }

    static put<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'PUT');
        return fetchBuilder;
    }

    static delete<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'DELETE');
        return fetchBuilder;
    }

    static patch<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'PATCH');
        return fetchBuilder;
    }

    static head<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'HEAD');
        return fetchBuilder;
    }

    static options<TExpectedResult>(endpoint: string): FetchBuilder<TExpectedResult> {
        const fetchBuilder = new FetchBuilder<TExpectedResult>(endpoint, 'OPTIONS');
        return fetchBuilder;
    }

    setHeaders(headers: { [key: string]: string }): FetchBuilder<TExpectedResult> {
        this.headers = headers;
        return this;
    }

    setBody(body: any): FetchBuilder<TExpectedResult> {
        this.body = body;
        return this;
    }

    async execute(): Promise<FetchBuilderResult<TExpectedResult>> {
        const response = await fetch(this.endpoint, {
            method: this.method,
            headers: this.headers,
            body: this.body
        });

        const result = await this.handleResponse(response);
        return result;
    }

    private async handleResponse(response: FetchResponse): Promise<FetchBuilderResult<TExpectedResult>> {

        if (!response.ok) {
            const rawBody = await response.text();
            throw new FetchBuilderError(`Request failed with ${response.statusText} status`, response, rawBody);
        }

        this.result = {
            ok: response.ok,
            status: response.status,
            rawResponse: response,
            body: await response.json()
        };

        return this.result;
    }
}