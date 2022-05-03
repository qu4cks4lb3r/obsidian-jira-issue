export enum ESearchResultsRenderingTypes {
    TABLE = 'TABLE',
    LIST = 'LIST',
}
export const SEARCH_RESULTS_RENDERING_TYPE_DESCRIPTION = {
    [ESearchResultsRenderingTypes.TABLE]: 'Table',
    [ESearchResultsRenderingTypes.LIST]: 'List',
}

// TODO: jira-search custom columns
export enum ESearchColumnsTypes {
    KEY = 'KEY',
    SUMMARY = 'SUMMARY',
    TYPE = 'TYPE',
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    REPORTER = 'REPORTER',
    ASSIGNEE = 'ASSIGNEE',
    PRIORITY = 'PRIORITY',
    STATUS = 'STATUS',
    DUE_DATE = 'DUE_DATE',
    RESOLUTION = 'RESOLUTION',
    RESOLUTION_DATE = 'RESOLUTION_DATE',
    PROJECT = 'PROJECT',
    ENVIRONMENT = 'ENVIRONMENT',
    // AGGREGATE_PROGRESS = 'AGGREGATE_PROGRESS',
    // AGGREGATE_TIME_ESTIMATED = 'AGGREGATE_TIME_ESTIMATED',
    // AGGREGATE_TIME_ORIGINAL_ESTIMATE = 'AGGREGATE_TIME_ORIGINAL_ESTIMATE',
    // AGGREGATE_TIME_SPENT = 'AGGREGATE_TIME_SPENT',
    FIX_VERSIONS = 'FIX_VERSIONS',
    // LINKS = 'LINKS',
    LABELS = 'LABELS',
    COMPONENTS = 'COMPONENTS',
    // LAST_VIEWED = 'LAST_VIEWED',
    // PROGRESS = 'PROGRESS',
    // SUBTASKS = 'SUBTASKS',
    // TIME_ESTIMATED = 'TIME_ESTIMATED',
    // TIME_ORIGINAL_ESTIMATE = 'TIME_ORIGINAL_ESTIMATE',
    // TIME_SPENT = 'TIME_SPENT',

    // CUSTOM_FIELD = 'CUSTOM_FIELD',
}
export const SEARCH_COLUMNS_DESCRIPTION = {
    [ESearchColumnsTypes.KEY]: 'Key',
    [ESearchColumnsTypes.SUMMARY]: 'Summary',
    [ESearchColumnsTypes.TYPE]: 'Type',
    [ESearchColumnsTypes.CREATED]: 'Created',
    [ESearchColumnsTypes.UPDATED]: 'Updated',
    [ESearchColumnsTypes.REPORTER]: 'Reporter',
    [ESearchColumnsTypes.ASSIGNEE]: 'Assignee',
    [ESearchColumnsTypes.PRIORITY]: 'Priority',
    [ESearchColumnsTypes.STATUS]: 'Status',
    [ESearchColumnsTypes.DUE_DATE]: 'Due Date',
    [ESearchColumnsTypes.RESOLUTION]: 'Resolution',
    [ESearchColumnsTypes.RESOLUTION_DATE]: 'Resolution Date',
    [ESearchColumnsTypes.PROJECT]: 'Project',
    [ESearchColumnsTypes.ENVIRONMENT]: 'Environment',
    // [ESearchColumnsTypes.AGGREGATE_PROGRESS]: 'Aggregate Progress',
    // [ESearchColumnsTypes.AGGREGATE_TIME_ESTIMATED]: 'Aggregate Time Estimated',
    // [ESearchColumnsTypes.AGGREGATE_TIME_ORIGINAL_ESTIMATE]: 'Aggregate Time Original Estimate',
    // [ESearchColumnsTypes.AGGREGATE_TIME_SPENT]: 'Aggregate Time Spent',
    [ESearchColumnsTypes.FIX_VERSIONS]: 'Fix Versions',
    // [ESearchColumnsTypes.LINKS]: 'Links',
    [ESearchColumnsTypes.LABELS]: 'Labels',
    [ESearchColumnsTypes.COMPONENTS]: 'Components',
    // [ESearchColumnsTypes.LAST_VIEWED]: 'Last Viewed',
    // [ESearchColumnsTypes.PROGRESS]: 'Progress',
    // [ESearchColumnsTypes.SUBTASKS]: 'Subtasks',
    // [ESearchColumnsTypes.TIME_ESTIMATED]: 'Time Estimated',
    // [ESearchColumnsTypes.TIME_ORIGINAL_ESTIMATE]: 'Time Original Estimate',
    // [ESearchColumnsTypes.TIME_SPENT]: 'Time Spent',

    // [ESearchColumnsTypes.CUSTOM]: 'Custom',
}

export interface ISearchColumn {
    type: ESearchColumnsTypes
    compact: boolean
    customField?: string
}

export class SearchView {
    type: ESearchResultsRenderingTypes = ESearchResultsRenderingTypes.TABLE
    query: string = ''
    limit: string = ''
    columns: ISearchColumn[] = []

    fromString(str: string): SearchView {
        for (const line of str.split('\n')) {
            if (line && !line.trimStart().startsWith('#')) {
                let [key, value] = line.split(':')

                if (!value) {
                    this.type = ESearchResultsRenderingTypes.TABLE
                    this.query = str
                    this.limit = ''
                    this.columns = []
                    break
                }

                switch (key) {
                    case 'type':
                        value = value.trim()
                        if (value.toUpperCase() in ESearchResultsRenderingTypes) {
                            this.type = value.toUpperCase() as ESearchResultsRenderingTypes
                        } else {
                            throw new Error(`Invalid type: ${value}`)
                        }
                        break
                    case 'query':
                        this.query = value
                        break
                    case 'limit':
                        if (parseInt(value)) {
                            this.limit = parseInt(value).toString()
                        } else {
                            throw new Error(`Invalid limit: ${value}`)
                        }
                        break
                    case 'columns':
                        this.columns = value.split(',').map(column => {
                            const compact = column.trim().startsWith('#')
                            column = column.trim().replace('#', '').toUpperCase()
                            if (!(column in ESearchColumnsTypes)) {
                                throw new Error(`Invalid column: ${column}`)
                            }
                            return {
                                type: column as ESearchColumnsTypes,
                                compact: compact,
                                customField: '',
                            }
                        })
                        break
                    default:
                        throw new Error(`Invalid key: ${key}`)
                }
            }
        }
        return this
    }

    toString(): string {
        let result = '```jira-search\n'
        result += `type: ${this.type}\n`
        result += `query: ${this.query}\n`
        if (this.limit) {
            result += `limit: ${this.limit}\n`
        }
        if (this.columns.length > 0) {
            result += `columns: ${this.columns.map(c => (c.compact ? '#' : '') + c.type).join(', ')}\n`
        }
        return result + '```'
    }
}