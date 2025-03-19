"use client";

import { useActiveSaleTab, useSalesStore } from "@/store/seller";
import SalesTabButton from "./SalesTabButton";
import { OrderStatus } from "@prisma/client";

type TabOptionsType = {
  label: string;
  tabName: string;
  status: OrderStatus | 'all';
}

function SalesTabOptions() {

  const getSalesWithStatus = useSalesStore(state => state.getSalesOfStatus);
  const activeTab = useActiveSaleTab(state => state.active);

  const tabOptions: TabOptionsType[] = [
                      { label: "All Orders", tabName: 'all', status: 'all' },
                      { label: "New Orders", tabName: 'new', status: 'PENDING' },
                      { label: "Shipped", tabName: 'ship', status: 'SHIPPED' },
                      { label: "Delivered", tabName: 'deliver', status: 'DELIVERED' },
                      { label: "Cancelled", tabName: 'cancel', status: 'CANCELLED' }
                     ];

  return (
    <div className="m-2 mb-0 flex items-center bg-zinc-800 rounded-t-xl overflow-hidden">
      { tabOptions.map((button) => (
          <SalesTabButton
            key={button.tabName}
            label={button.label}
            isActive={activeTab == button.tabName}
            onClick={() => getSalesWithStatus(button.status)}
          />)
        )
      }
    </div>
  );
}

export default SalesTabOptions;