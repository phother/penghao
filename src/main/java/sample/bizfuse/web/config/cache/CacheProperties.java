package sample.bizfuse.web.config.cache;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created by liuyg on 17-2-23.
 */

@Component
@ConfigurationProperties(prefix = "cache", ignoreUnknownFields = false)
public class CacheProperties {

    private CacheProperties.Hazelcast hazelcast = new CacheProperties.Hazelcast();

    public CacheProperties.Hazelcast getHazelcast() {
        return this.hazelcast;
    }

    public static class Hazelcast {
        private int timeToLiveSeconds = 3600;
        private int backupCount = 1;

        public int getTimeToLiveSeconds() {
            return this.timeToLiveSeconds;
        }

        public void setTimeToLiveSeconds(int timeToLiveSeconds) {
            this.timeToLiveSeconds = timeToLiveSeconds;
        }

        public int getBackupCount() {
            return this.backupCount;
        }

        public void setBackupCount(int backupCount) {
            this.backupCount = backupCount;
        }
    }
}
