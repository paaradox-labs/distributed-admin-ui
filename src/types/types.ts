export type Credential = {
  email: string;
  password: string;
};

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  name: string
  tenant?: Tenant
}

export type CreateUserData = {
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  tenantId: number
}

export type Tenant = {
  id: number  
  name: string
  address: string
}

export type CreateTenantData = {
  name:string
  address: string
}

export type FieldData = {
  name: string[];
  value?: string;
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: 'base' | 'aditional';
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availableOptions: string[];
}


export type Category = {
  _id: number,
  name: string
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export type ProductAttribute = {
    name: string
    value: string | boolean;
}

export type Product = {
  _id: string
  name: string
  description: string
  category: Category
  status: boolean
  createdAt: string
  image: string
  isPublish: boolean
  priceConfiguration: PriceConfiguration
  attributes: ProductAttribute[]
}

export type ImageField = { file: File }

export type CreateProductData = Product & {
    image: ImageField
}

export enum OrderStatus {
    RECEIVED = 'received',
    CONFIRMED = 'confirmed',
    PREPARED = 'prepared',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum PaymentMode {
    CARD = 'card',
    CASH = 'cash',
}

export type Topping = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export interface CartItem extends Pick<Product, '_id' | 'name' | 'image' | 'priceConfiguration'> {
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedToppings: Topping[];
    };
    qty: number;
}

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
}
export interface Order {
    _id: string;
    image: unknown;
    cart: CartItem[];
    customerId: Customer;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    createdAt: string;
}

export type Coupon = {
    _id: string
    title: string
    code: string
    validUpto: string
    discount: number
    tenantId: number
    createdAt: string
    updatedAt: string
}

export type CreateCouponData = {
    title: string
    code: string
    validUpto: string
    discount: number
    tenantId: number
}

export enum OrderEvents {
  ORDER_CREATE = "ORDER_CREATE",
  PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
  ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
}