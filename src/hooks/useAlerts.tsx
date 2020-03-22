import React, { useState } from 'react';

import { AlertProps, AlertActionCloseButton } from '@patternfly/react-core';

export default function useAlerts() {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const addAlert = (alert: AlertProps, timeout = 3000) => {
    const key = alert.key || Date.now();
    setAlerts(alerts => [
      ...alerts,
      {
        ...alert,
        key,
        action: (
          <AlertActionCloseButton onClose={() => removeAlert(key)} />
        ),
      }
    ]);
    if (timeout > 0) {
      setTimeout(() => removeAlert(key), timeout);
    }
  };

  const removeAlert = (key: string | number) => {
    setAlerts(alerts => alerts.filter(alert => alert.key !== key));
  }

  return {
    alerts,
    addAlert,
    removeAlert,
  };
}
