import { NavBar } from "@/components/NavBar";
import { PersonIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceptionCheckout from "@/components/ReceptionCheckout";

export default function Reception() {
  return (
    <>
      <NavBar title={<PersonIcon />} />
      <div className="mt-3 justify-center">
        <Tabs defaultValue="checkout" className="top-3 mx-auto w-10/12">
          <TabsList>
            <TabsTrigger value="checkin">入住</TabsTrigger>
            <TabsTrigger value="checkout">退房</TabsTrigger>
          </TabsList>
          <TabsContent value="checkin">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex"></div>
          </TabsContent>
          <TabsContent value="checkout">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <ReceptionCheckout />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
