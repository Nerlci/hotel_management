import ReactPDF, {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { StatementItem } from "shared";

function isEven(n: number) {
  return n === 0 || !!(n && !(n % 2));
}

function formatDateTime(dateTime: string) {
  // YYYY-MM-DD HH:MM:SS
  return new Date(dateTime).toLocaleString("zh-CN");
}

Font.register({
  family: "HanSerifSC-VF",
  // TODO: get a better font
  src: "./src/utils/SourceHanSerifSC-VF.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "HanSerifSC-VF",
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// 详单
const Statement = (props: {
  headers: string[];
  statements: (string | number | null)[][];
  roomId: string;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 5,
          }}
        >
          {props.roomId} 详单
        </Text>
        <Table
          style={{
            fontSize: 12,
          }}
        >
          <TH
            style={{
              backgroundColor: "#ddd",
            }}
          >
            {props.headers.map((header) => (
              <TD key={header}>
                <Text
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontSize: 16,
                  }}
                >
                  {header}
                </Text>
              </TD>
            ))}
          </TH>
          {props.statements.map((statement, index) => (
            <TR
              key={statement[1]}
              style={{
                backgroundColor: !isEven(index) ? "#eee" : "#fff",
              }}
            >
              {Object.values(statement).map((value) => (
                <TD key={value}>
                  <Text
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    {value}
                  </Text>
                </TD>
              ))}
            </TR>
          ))}
        </Table>
      </Page>
    </Document>
  );
};

const Bill = () => {
  <Document>
    <Page size="A4" orientation="landscape"></Page>
  </Document>;
};

export async function renderStatement(
  headers: string[],
  statements: StatementItem[],
  roomId: string,
) {
  const stmts = statements.map((item) => [
    item.requestTime ? formatDateTime(item.requestTime) : "",
    formatDateTime(item.startTime),
    formatDateTime(item.endTime),
    item.duration,
    item.fanSpeed,
    item.price.toFixed(2),
    item.priceRate.toFixed(2),
    item.target,
    item.temp.toFixed(2),
  ]);
  return ReactPDF.renderToStream(
    <Statement headers={headers} statements={stmts} roomId={roomId} />,
  );
}
