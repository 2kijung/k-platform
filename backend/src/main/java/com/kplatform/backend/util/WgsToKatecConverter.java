package com.kplatform.backend.util;
import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;

import java.awt.geom.Point2D;

public class WgsToKatecConverter {
    private static final CRSFactory crsFactory = new CRSFactory();
    private static final CoordinateReferenceSystem wgs84 = crsFactory.createFromName("EPSG:4326");
    private static final CoordinateReferenceSystem katec = crsFactory.createFromName("EPSG:2097");
    private static final CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();
    private static final CoordinateTransform transform = ctFactory.createTransform(wgs84, katec);

    public static Point2D convert(double lat, double lng) {
        ProjCoordinate src = new ProjCoordinate(lng, lat); // WGS84 (lon, lat)
        ProjCoordinate dst = new ProjCoordinate();
        transform.transform(src, dst);
        return new Point2D.Double(dst.x, dst.y); // KATEC 좌표 반환
    }
}