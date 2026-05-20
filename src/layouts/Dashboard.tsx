import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { Layout, Menu, theme } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import FoodIcon from "../components/icons/FoodIcon";
import Home from "../components/icons/Home";
import Icon from "@ant-design/icons";
import UserIcon from "../components/icons/UserIcon";

const items = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={`/`} >Home</NavLink>
  },
  {
    key: "/user",
    icon: <Icon component={UserIcon} />,
    label: <NavLink to={`/users`}>Users</NavLink>
  },
  {
        key: '/restaurants',
        icon: <Icon component={FoodIcon} />,
        label: <NavLink to="/restaurants">Restaurants</NavLink>,
    },
    {
        key: '/products',
        icon: <Icon component={BasketIcon} />,
        label: <NavLink to="/products">Products</NavLink>,
    },
    {
        key: '/promos',
        icon: <Icon component={GiftIcon} />,
        label: <NavLink to="/promos">Promos</NavLink>,
    },
]

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to={`/auth/login`} replace={true} />;
  }
  return (
    <div>
      <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
        <div className="logo">
            <Logo />
        </div>
        <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
      <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Mernspace pizza shop
        </Footer>
      </Layout>
    </Layout>
    </div>
  );
};

export default Dashboard;
