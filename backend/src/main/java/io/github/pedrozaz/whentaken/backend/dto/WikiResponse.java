package io.github.pedrozaz.whentaken.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WikiResponse(
        @JsonProperty("query") Query query
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Query(
           @JsonProperty("pages") Map<String, Page> pages
    ) {}

    @JsonIgnoreProperties
    public record Page(
          @JsonProperty("pageid") long pageid,
          @JsonProperty("title") String title,
          @JsonProperty("imageinfo") List<ImageInfo> imageinfo
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ImageInfo(
            @JsonProperty("url") String url,
            @JsonProperty("extmetadata") ExtMetadata extmetadata
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ExtMetadata(
            @JsonProperty("DateTimeOriginal") MetadataValue DateTimeOriginal,
            @JsonProperty("GPSLatitude") MetadataValue GPSLatitude,
            @JsonProperty("GPSLongitude") MetadataValue GPSLongitude
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MetadataValue(
            @JsonProperty("value") String value
    ) {}
}
