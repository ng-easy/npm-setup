interface PackageHashes {
    packageLockJsonHash: string;
    packageJsonHash: string;
}
export declare function getPackageHashes(): Promise<PackageHashes>;
export {};
