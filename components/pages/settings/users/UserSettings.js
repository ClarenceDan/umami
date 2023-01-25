import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Breadcrumbs, Item, Tabs, useToast } from 'react-basics';
import Link from 'next/link';
import UserEditForm from 'components/pages/settings/users//UserEditForm';
import Page from 'components/layout/Page';
import PageHeader from 'components/layout/PageHeader';
import useApi from 'hooks/useApi';
import { labels, messages } from 'components/messages';
import UserWebsites from './UserWebsites';

export default function UserSettings({ userId }) {
  const { formatMessage } = useIntl();
  const [edit, setEdit] = useState(false);
  const [values, setValues] = useState(null);
  const [tab, setTab] = useState('details');
  const { get, useQuery } = useApi();
  const { toast, showToast } = useToast();
  const { data, isLoading } = useQuery(
    ['user', userId],
    () => {
      if (userId) {
        return get(`/users/${userId}`);
      }
    },
    { cacheTime: 0 },
  );

  const handleSave = data => {
    showToast({ message: formatMessage(messages.saved), variant: 'success' });
    if (data) {
      setValues(state => ({ ...state, ...data }));
    }

    if (edit) {
      setEdit(false);
    }
  };

  useEffect(() => {
    if (data) {
      setValues(data);
    }
  }, [data]);

  return (
    <Page loading={isLoading || !values}>
      {toast}
      <PageHeader>
        <Breadcrumbs>
          <Item>
            <Link href="/settings/users">{formatMessage(labels.users)}</Link>
          </Item>
          <Item>{values?.username}</Item>
        </Breadcrumbs>
      </PageHeader>
      <Tabs selectedKey={tab} onSelect={setTab} style={{ marginBottom: 30, fontSize: 14 }}>
        <Item key="details">{formatMessage(labels.details)}</Item>
        <Item key="websites">{formatMessage(labels.websites)}</Item>
      </Tabs>
      {tab === 'details' && <UserEditForm userId={userId} data={values} onSave={handleSave} />}
      {tab === 'websites' && <UserWebsites userId={userId} />}
    </Page>
  );
}
