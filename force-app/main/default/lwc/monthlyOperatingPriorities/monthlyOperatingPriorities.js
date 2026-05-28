import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';
import { CloseActionScreenEvent } from 'lightning/actions';
import KRAFT_HEINZ_LOGO from '@salesforce/resourceUrl/KraftHeinzLogo';

const COLUMN_MAP = {
    'Core 6 Priorities': [
        { key: 'brand', label: 'Brand', field: 'Brand__c', cssClass: 'col-brand' },
        { key: 'priority', label: 'Priorities', field: 'Priority_Description__c', cssClass: 'col-wide' },
        { key: 'notes', label: 'Notes', field: 'Notes__c', cssClass: 'col-notes' }
    ],
    'Innovation Priorities': [
        { key: 'brand', label: 'Brand', field: 'Brand__c', cssClass: 'col-brand' },
        { key: 'dates', label: 'Dates', field: 'Dates__c', cssClass: 'col-dates' },
        { key: 'info', label: 'Info', field: 'Priority_Description__c', cssClass: 'col-wide' },
        { key: 'notes', label: 'Notes', field: 'Notes__c', cssClass: 'col-notes' }
    ],
    'Kraft Dinner Deluxe': [
        { key: 'item', label: 'Item', field: 'Brand__c', cssClass: 'col-brand' },
        { key: 'timing', label: 'Timing', field: 'Dates__c', cssClass: 'col-dates' },
        { key: 'details', label: 'Details', field: 'Priority_Description__c', cssClass: 'col-wide' },
        { key: 'notes', label: 'Notes', field: 'Notes__c', cssClass: 'col-notes' }
    ],
    'Cycle Priorities': [
        { key: 'cycle', label: 'Cycle Dates', field: 'Dates__c', cssClass: 'col-dates' },
        { key: 'booking', label: 'Booking Window', field: 'Booking_Window__c', cssClass: 'col-dates' },
        { key: 'oncycle', label: 'On Cycle', field: 'On_Cycle__c', cssClass: 'col-wide' },
        { key: 'price', label: 'Price Point', field: 'Price_Point__c', cssClass: 'col-price' },
        { key: 'notes', label: 'Notes', field: 'Notes__c', cssClass: 'col-notes' }
    ]
};

const TAB_LIST = [
    'Priorities',
    'SUMMER PLANS',
    'Mexico Trip Accolades',
    'Innovation Updates',
    'FreshCo Cycle Timing',
    'Liquids Program'
];

export default class MonthlyOperatingPriorities extends LightningElement {
    logoUrl = KRAFT_HEINZ_LOGO;
    activeTab = 'Priorities';
    allRecords = [];
    error;

    @wire(graphql, {
        query: gql`
            query GetPriorities {
                uiapi {
                    query {
                        Monthly_Operating_Priority__c(
                            orderBy: {
                                Tab__c: { order: ASC }
                                Section__c: { order: ASC }
                                Sort_Order__c: { order: ASC }
                            }
                            first: 200
                        ) {
                            edges {
                                node {
                                    Id
                                    Tab__c { value }
                                    Section__c { value }
                                    Sort_Order__c { value }
                                    Brand__c { value }
                                    Priority_Description__c { value }
                                    Dates__c { value }
                                    Booking_Window__c { value }
                                    On_Cycle__c { value }
                                    Price_Point__c { value }
                                    Notes__c { value }
                                }
                            }
                        }
                    }
                }
            }
        `
    })
    wiredPriorities({ errors, data }) {
        if (data) {
            const edges = data.uiapi.query.Monthly_Operating_Priority__c.edges;
            this.allRecords = edges.map(edge => {
                const node = edge.node;
                return {
                    Id: node.Id,
                    Tab__c: node.Tab__c.value,
                    Section__c: node.Section__c.value,
                    Sort_Order__c: node.Sort_Order__c.value,
                    Brand__c: node.Brand__c.value || '',
                    Priority_Description__c: node.Priority_Description__c.value || '',
                    Dates__c: node.Dates__c.value || '',
                    Booking_Window__c: node.Booking_Window__c.value || '',
                    On_Cycle__c: node.On_Cycle__c.value || '',
                    Price_Point__c: node.Price_Point__c.value || '',
                    Notes__c: node.Notes__c.value || ''
                };
            });
            this.error = undefined;
        } else if (errors) {
            this.error = errors.map(e => e.message).join(', ');
            this.allRecords = [];
        }
    }

    get tabs() {
        return TAB_LIST.map(name => ({
            name,
            cssClass: 'tab-button' + (name === this.activeTab ? ' active' : '')
        }));
    }

    get hasData() {
        return this.currentSections.length > 0;
    }

    get isPlaceholderTab() {
        const tabRecords = this.allRecords.filter(r => r.Tab__c === this.activeTab);
        return tabRecords.length === 0 && !this.error;
    }

    get currentSections() {
        const tabRecords = this.allRecords.filter(r => r.Tab__c === this.activeTab);
        if (tabRecords.length === 0) return [];

        const sectionMap = {};
        tabRecords.forEach(record => {
            const sectionName = record.Section__c;
            if (!sectionMap[sectionName]) {
                sectionMap[sectionName] = [];
            }
            sectionMap[sectionName].push(record);
        });

        return Object.keys(sectionMap).map(sectionName => {
            const columns = COLUMN_MAP[sectionName] || COLUMN_MAP['Core 6 Priorities'];
            const records = sectionMap[sectionName];
            const rows = records.map(record => ({
                id: record.Id,
                cells: columns.map(col => ({
                    key: record.Id + '-' + col.key,
                    value: record[col.field] || '',
                    cssClass: col.cssClass
                }))
            }));

            return { name: sectionName, columns, rows };
        });
    }

    handleTabClick(event) {
        this.activeTab = event.currentTarget.dataset.tab;
    }

    handleClose() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
