import ReactPDF, {
  Page,
  Text,
  Document,
  Font,
  View,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { StatementItem, BillItem } from "shared";

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

// 详单
const Statement = (props: {
  headers: string[];
  statements: (string | number | null)[][];
  roomId: string;
}) => {
  const sum = props.statements.reduce((acc, cur) => {
    return acc + Number(cur[5]);
  }, 0);

  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: "HanSerifSC-VF",
          flexDirection: "column",
          backgroundColor: "#fff",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginVertical: 15,
            marginHorizontal: 10,
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 40,
            }}
          >
            HOTEL-BUPT
          </Text>
          <View style={{ flexGrow: 1 }} />
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {props.roomId} 详单
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 10,
          }}
        >
          <Table
            style={{
              fontSize: 12,
            }}
          >
            <TH
              style={{
                backgroundColor: "#BED0F5",
                height: 25,
              }}
            >
              {props.headers.map((header, index) => (
                <TD
                  key={header}
                  style={{
                    border: "none",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      fontSize: 12,
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
                  backgroundColor: !isEven(index) ? "#E0EEFF" : "#fff",
                }}
              >
                {statement.map((value, index) => (
                  <TD
                    key={value}
                    style={{
                      border: "none",
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        fontSize: index < 3 ? 8 : 10,
                      }}
                    >
                      {value}
                      {index === 5 || index === 6
                        ? "￥"
                        : index === 7 || index === 8
                          ? "°C"
                          : index === 3
                            ? "s"
                            : ""}
                    </Text>
                  </TD>
                ))}
              </TR>
            ))}
          </Table>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <View style={{ flexGrow: 1 }} />
          <Text
            style={{
              fontSize: 12,
            }}
          >
            总计：{sum.toFixed(2)}￥
          </Text>
        </View>
        <View style={{ flexGrow: 1 }} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View style={{ flexGrow: 1 }} />
            <Text>{new Date().toLocaleDateString("zh-CN")}</Text>
          </View>
          <View style={{ flexGrow: 1 }} />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text>巴普特酒店</Text>
            <Text>地址：北京市朝阳区朝阳路 37 号</Text>
            <Text>电话：010-12345678</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// 账单
const Bill = (props: {
  headers: string[];
  bills: (string | number | null)[][];
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}) => {
  const totalFee = props.bills.reduce(
    (acc, cur) => acc + Number(cur[3]),
    0,
  );
  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: "HanSerifSC-VF",
          flexDirection: "column",
          backgroundColor: "#fff",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginVertical: 15,
            marginHorizontal: 10,
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 40,
            }}
          >
            HOTEL-BUPT
          </Text>
          <View style={{ flexGrow: 1 }} />
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {props.roomId} 账单
          </Text>
        </View>
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 12,
          }}
        >
          入住日期: {props.checkInDate} 退房日期: {props.checkOutDate}
        </Text>
        <View
          style={{
            marginHorizontal: 10,
          }}
        >
          <Table
            style={{
              fontSize: 12,
            }}
          >
            <TH
              style={{
                backgroundColor: "#BED0F5",
                height: 25,
              }}
            >
              {props.headers.map((header, index) => (
                <TD
                  key={header}
                  style={{
                    border: "none",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      fontSize: 12,
                    }}
                  >
                    {header}
                  </Text>
                </TD>
              ))}
            </TH>
            {props.bills.map((bill, index) => (
              <TR
                key={index}
                style={{
                  backgroundColor: !isEven(index) ? "#E0EEFF" : "#fff",
                }}
              >
                {bill.map((value, index) => (
                  <TD
                    key={index}
                    style={{
                      border: "none",
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        fontSize: index < 3 ? 8 : 10,
                      }}
                    >
                      {value}
                    </Text>
                  </TD>
                ))}
              </TR>
            ))}
          </Table>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <View style={{ flexGrow: 1 }} />
          <Text
            style={{
              fontSize: 12,
            }}
          >
            总计: {totalFee.toFixed(2)}￥
          </Text>
        </View>
        <View style={{ flexGrow: 1 }} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View style={{ flexGrow: 1 }} />
            <Text>{new Date().toLocaleDateString("zh-CN")}</Text>
          </View>
          <View style={{ flexGrow: 1 }} />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text>巴普特酒店</Text>
            <Text>地址：北京市朝阳区朝阳路 37 号</Text>
            <Text>电话：010-12345678</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
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

export async function renderBill(
  headers: string[],
  bills: BillItem[],
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
) {
  const billData = bills.map((item) => [
    item.name,
    item.price,
    item.quantity,
    item.subtotal,
  ]);
  return ReactPDF.renderToStream(
    <Bill
      headers={headers}
      bills={billData}
      roomId={roomId}
      checkInDate={formatDateTime(checkInDate)}
      checkOutDate={formatDateTime(checkOutDate)}
    />,
  );
}
