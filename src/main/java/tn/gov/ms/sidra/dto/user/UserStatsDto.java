package tn.gov.ms.sidra.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long totalStructures;
    private long activeStructures;
    private UserRoleStatsDto usersByRole;
    private StructureTypeStatsDto structuresByType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRoleStatsDto {
        private long superAdmin;
        private long adminStructure;
        private long utilisateur;
        private long externe;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StructureTypeStatsDto {
        private long publique;
        private long privee;
        private long ong;
    }
}