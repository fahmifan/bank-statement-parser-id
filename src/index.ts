import { parseBCAStatement } from './bank_report_parser/bca_parser';
import { parseMandiriStatement } from './bank_report_parser/mandiri_parser';
import { parseMandiriCCStatement } from './bank_report_parser/mandiri_cc_parser';

export default {
    parseBCAStatement,
    parseMandiriCCStatement,
    parseMandiriStatement,
}