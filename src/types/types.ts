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

export type Category = {
  _id: number,
  name: string
}