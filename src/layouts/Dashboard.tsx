import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Avatar, Badge, Button, Drawer, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import FoodIcon from "../components/icons/FoodIcon";
import Home from "../components/icons/Home";
import Icon, { BellFilled, MenuUnfoldOutlined } from "@ant-design/icons";
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
    menus.splice(2,0, {
        key: '/restaurants',
        icon: <Icon component={FoodIcon} />,
        label: <NavLink to="/restaurants">Restaurants</NavLink>,
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate()
  const { user } = useAuthStore()
  if (user === null) {
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
  }
  
  const items = getMenuItems(user.role)

  const goHome = () => navigate("/")

  const sidebarMenu = (
    <Menu theme="light" selectedKeys={[location.pathname]} mode="inline" items={items} onClick={() => setMobileDrawerOpen(false)} />
  )

  return (
    <div>
      <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          setIsMobile(broken)
          if (broken) setCollapsed(true)
        }}
        trigger={null}
      >
        <div className="logo" style={{ cursor: "pointer" }} onClick={goHome}>
            <Logo />
        </div>
        {sidebarMenu}
      </Sider>
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={220}
          styles={{ body: { padding: 0 } }}
        >
          <div style={{ padding: "16px 0 0 24px", cursor: "pointer" }} onClick={() => { goHome(); setMobileDrawerOpen(false); }}>
            <Logo />
          </div>
          {sidebarMenu}
        </Drawer>
      )}
      <Layout>
        <Header style={{ paddingLeft: "16px", paddingRight: "16px", background: colorBgContainer }}>
          <Flex gap="medium" align="center" justify="space-between" wrap="wrap">
            <Space>
              {isMobile && (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setMobileDrawerOpen(true)}
                />
              )}
              <Badge text={user.role === "admin" ? "Admin" : user.tenant?.name} status="success" />
            </Space>
            <Space size={16}>
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
        <Content style={{ margin: "24px", marginTop: isMobile ? "16px" : "24px" }}>
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
