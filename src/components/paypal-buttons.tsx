import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';

type PaypalButtonsProps = {
  createOrder: () => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  disabled: boolean;
};

function PaypalButtons({ createOrder, onApprove, disabled }: PaypalButtonsProps) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    currency: 'USD',
    'data-page-type': 'product-details',
    components: 'buttons',
    'data-sdk-integration-source': 'developer-studio',
  };

  const router = useRouter();

  return (
    <div className="w-full px-5 py-5">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          disabled={disabled}
          style={{
            shape: 'rect',
            layout: 'horizontal',
            color: 'black',
            label: 'pay',
            height: 44,
            tagline: false,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
}

export default PaypalButtons;
