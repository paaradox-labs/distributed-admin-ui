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

export type Product = {
  _id: string
  name: string
  description: string
  category: Category
  status: boolean
  createdAt: string
  image: string
  isPublish: boolean
}

export type ImageField = { file: File }

export type CreateProductData = Product & {
    image: ImageField
}