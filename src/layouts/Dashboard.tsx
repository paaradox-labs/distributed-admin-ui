import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import { Avatar, Badge,  Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import FoodIcon from "../components/icons/FoodIcon";
import Home from "../components/icons/Home";
import Icon, { BellFilled } from "@ant-design/icons";
import UserIcon from "../components/icons/UserIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const getMenuItems = (role: string) => {
  const baseItems = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={`/`} >Home</NavLink>, 
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
  ];

  if(role === "admin"){
    const menus =  [...baseItems];
    menus.splice(1,0,{
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to={"/users"}>Users</NavLink>
    })
  return menus;
  }
  return baseItems;
}

const Dashboard = () => {
  const location = useLocation()

  const {logout: logoutFromStore  } = useAuthStore()

    const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } = useAuthStore()
  if (user === null) {
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
  }
  
  const items = getMenuItems(user.role)

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
        <Header style={{ paddingLeft: "16px", paddingRight: "16px", background: colorBgContainer }}>
          <Flex gap="medium" align="start" justify="space-between">
            <Badge text={user.role === "admin" ? "Admin" : user.tenant?.name} status="success" />
            <Space
            size={16}
            >
            <Badge dot={true}>
                <BellFilled />
            </Badge>
            <Dropdown menu={{ items: [
                  {
                    key: "logout",
                    label: "Logout",
                    onClick: () => logoutMutate()
                  }
                ] }} placement="bottomRight" arrow>
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
      </Dropdown>
            </Space>
          </Flex>
        </Header>
        <Content style={{ margin: '24px' }}>
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
