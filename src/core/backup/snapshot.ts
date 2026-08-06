export interface BackupSnapshot {
    id: string
    createdAt: string
    description: string
    dataHash: string
}

export function createBackupSnapshot(description: string): BackupSnapshot {
    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        description,
        dataHash: '',
    }
}
