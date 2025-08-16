import { useState, useEffect } from 'react';
import { CameraData } from '../components/scenarios/CameraCard';

interface UseScenarioCamerasResult {
  cameras: CameraData[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  isUsingFallback: boolean;
}

interface UseScenarioCamerasOptions {
  timeout?: number;
  enableFallback?: boolean;
}

export function useScenarioCameras(
  scenarioId: string,
  options: UseScenarioCamerasOptions = {}
): UseScenarioCamerasResult {
  const { timeout = 3000, enableFallback = true } = options;
  
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchCameras = async () => {
    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      // Primary API call
      const apiPromise = fetch(`/api/cameras/${scenarioId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }
          return response.json();
        });

      // Race between API call and timeout
      const result = await Promise.race([apiPromise, timeoutPromise]);
      
      setCameras(result.cameras || []);
      setIsLoading(false);
      
    } catch (apiError) {
      console.warn(`API request failed for scenario ${scenarioId}:`, apiError);
      
      // Try fallback data if enabled
      if (enableFallback) {
        try {
          const fallbackResponse = await fetch(`/data/cameras/${scenarioId}.json`);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setCameras(fallbackData.cameras || []);
            setIsUsingFallback(true);
            console.info(`Using fallback data for scenario ${scenarioId}`);
          } else {
            throw new Error('Fallback data not available');
          }
        } catch (fallbackError) {
          console.error(`Fallback data failed for scenario ${scenarioId}:`, fallbackError);
          setError('无法加载摄像头数据，请检查网络连接或联系管理员');
          setCameras([]);
        }
      } else {
        setError('无法连接到服务器，请稍后重试');
        setCameras([]);
      }
      
      setIsLoading(false);
    }
  };

  const retry = () => {
    fetchCameras();
  };

  useEffect(() => {
    if (scenarioId) {
      fetchCameras();
    }
  }, [scenarioId, timeout, enableFallback]);

  return {
    cameras,
    isLoading,
    error,
    retry,
    isUsingFallback
  };
}

// Utility hook for individual camera operations
export function useCameraActions() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const retryStream = (cameraId: string) => {
    console.log(`Retrying stream for camera: ${cameraId}`);
    setToastMessage(`正在重新连接摄像头 ${cameraId}...`);
    
    // Simulate retry operation
    setTimeout(() => {
      setToastMessage(`摄像头 ${cameraId} 重连成功`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  const reportIssue = (cameraId: string) => {
    console.log(`Reporting issue for camera: ${cameraId}`);
    setToastMessage(`已提交摄像头 ${cameraId} 的问题报告`);
    
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCameraDetail = (camera: CameraData) => {
    console.log(`Opening detail view for camera:`, camera);
    // This would typically open a modal or navigate to a detail page
  };

  return {
    retryStream,
    reportIssue,
    openCameraDetail,
    toastMessage,
    clearToast: () => setToastMessage(null)
  };
}