package tn.gov.ms.sidra.entity;

import lombok.Getter;

@Getter
public enum UserRole {
    SUPER_ADMIN("Super Administrateur"),
    ADMIN_STRUCTURE("Administrateur Structure"),
    UTILISATEUR("Utilisateur"),
    EXTERNE("Utilisateur Externe");

    private final String label;

    UserRole(String label) {
        this.label = label;
    }

}