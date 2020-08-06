import React, { useState } from 'react';
import UsersGrid from '../UsersGrid';
import VideosGrid from '../VideosGrid';
import { FaUsers, FaPhotoVideo } from 'react-icons/fa';
import { AppBar } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs'
import Box from '@material-ui/core/Box';

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`nav-tabpanel-${index}`}
        aria-labelledby={`nav-tab-${index}`}
        {...other}
    >
        {value === index && (
            <Box p={3}>
                {children}
            </Box>
        )}
    </div>
);

const CustomTabs = () => {
    const [selectedTab, setSelectedTab] = useState(1);

    return (
        <div className="tabs">
            <AppBar position="static">
                <Tabs 
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    variant="fullWidth"
                    >
                    <Tab icon={<FaUsers />} label="users" />
                    <Tab icon={<FaPhotoVideo />} label="videos" />
                </Tabs>
            </AppBar>
            <TabPanel value={selectedTab} index={0}>
                <UsersGrid />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <VideosGrid />
            </TabPanel>
        </div>
    );
};

export default CustomTabs;