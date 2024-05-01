import { NavBar } from "@/components/NavBar";
import { PersonIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceptionBill from "@/components/ReceptionBill";
import ReceptionCheckinCheckout from "@/components/ReceptionCheckinCheckout";

export default function Reception() {
  return (
    <>
      <NavBar title={<PersonIcon />} />
      <div className="mt-3 justify-center">
        <Tabs defaultValue="bill" className="top-3 mx-auto w-10/12">
          <TabsList>
            <TabsTrigger value="checkinout">入住与退房</TabsTrigger>
            <TabsTrigger value="bill">详单与账单</TabsTrigger>
          </TabsList>
          <TabsContent value="checkinout">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <ReceptionCheckinCheckout />
            </div>
          </TabsContent>
          <TabsContent value="bill">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <ReceptionBill />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
